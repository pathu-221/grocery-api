import {
  ConflictException,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaypalService } from 'src/shared/services/paypal/paypal.service';
import { Prisma } from '@prisma/client';
import { HelperService } from 'src/shared/services/helper/helper.service';
import { AddressService } from 'src/user-address/user-address.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { IRequestOptions } from 'src/shared/interfaces/common.interface';
import { ProductService } from 'src/admin/product/product.service';
import { PaymentStatus } from 'src/shared/interfaces/enum';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly helpersService: HelperService,
    private readonly addressService: AddressService,
    private readonly paypalService: PaypalService,
    private readonly productService: ProductService,
  ) {}

  async placeOrder(userId: string, createOrderDto: CreateOrderDto) {
    const cartItems = await this.cartService.findAll(userId, {
      product: {
        select: {
          base_price: true,
          name: true,
          quantity: true,
          description: true,
        },
      },
    });

    if (cartItems.length === 0)
      throw new BadRequestException('There are no cart Items!');

    let total = 0;
    cartItems.map((cartItem) => {
      if (cartItem.product.quantity === 0)
        throw new ConflictException(
          `${cartItem.product.name} is out of Stock!`,
        );

      if (cartItem.quantity > cartItem.product.quantity)
        throw new ConflictException(
          `Not enough ${cartItem.product.name} Available!`,
        );

      total += cartItem.quantity * cartItem.product.base_price;
    });

    const address = await this.addressService.findOneBy({
      id: createOrderDto.addressId,
    });

    if (!address) throw new NotFoundException('Address not found!');

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          grand_total: total,
          total_items: cartItems.length,
          buyer_id: userId,
          payment_type: 'paypal',
          shipping_address_1: address.address_1,
          shipping_address_2: address.address_2,
          shipping_city: address.city,
          shipping_state: address.state,
          shipping_zip: address.zip,
          shipping_address_name: address.name,
        },
      });

      //create order items
      await tx.orderItem.createMany({
        data: cartItems.map((cartItem) => {
          return {
            product_id: cartItem.product_id,
            product_quantity: cartItem.quantity,
            order_id: order.id,
            product_price: cartItem.product.base_price,
          };
        }),
      });

      const paypalordersJson = this.paypalService.generatePaypalCheckoutJson(
        cartItems,
        userId,
        total,
        order.id,
      );

      const paypalPaymentUrl =
        await this.paypalService.generatePaypalPaymentUrl(paypalordersJson);

      await this.updateOneBy(
        { id: order.id },
        {
          payment_url: paypalPaymentUrl.links[1].href,
        },
        { transaction: tx },
      );

      await this.cartService.deleteAllUserCartItems(userId, {
        transaction: tx,
      });
      return {
        order,
        paymentUrl: paypalPaymentUrl.links.find(
          (link) => link.rel === 'approval_url',
        ).href,
      };
    });
  }

  async successPayment(
    userId: string,
    paymentId: string,
    payerId: string,
    orderId: string,
  ) {
    const executedPayment = await this.paypalService.executePayment(
      payerId,
      paymentId,
      {
        payer_id: payerId,
      },
    );

    if (executedPayment.state === 'approved') {
      return await this.prisma.$transaction(async (tx) => {
        // updates paymentstatus and paymentrefid
        await this.updateOneBy(
          { id: orderId },
          {
            payment_status: PaymentStatus.PAID,
            payment_id: executedPayment.id,
          },
          { transaction: tx },
        );

        //update product stocks
        const orderItems = await this.findAllOrderItemsBy(
          { order_id: orderId },
          {
            product: true,
            orders: { select: { buyer_id: true } },
          },
        );

        for (let i = 0; i < orderItems.length; i++) {
          const orderItem = orderItems[i];
          await this.productService.update(
            orderItem.product_id,
            {
              quantity: { decrement: orderItem.product_quantity },
            } as Prisma.ProductUpdateInput,
            { transaction: tx },
          );
        }

        return executedPayment;
      });
    }
  }

  async getPaginatedData(userId: string, currentPage = 1, perPage = 25) {
    const paginatedData = await this.helpersService.getPaginatedData(
      'Order',
      currentPage,
      perPage,
      { buyer_id: userId },
    );
    return paginatedData;
  }

  async updateOneBy(
    where: Prisma.OrderWhereUniqueInput,
    data: Prisma.OrderUpdateInput,
    requestOptions?: IRequestOptions,
  ) {
    const client = requestOptions?.transaction || this.prisma;

    const updatedOrder = await client.order.update({ where, data });
    return updatedOrder;
  }

  async findAllOrderItemsBy(
    where: Prisma.OrderItemWhereInput,
    include?: Prisma.OrderItemInclude,
  ) {
    const orderItems = await this.prisma.orderItem.findMany({
      where,
      include,
    });
    return orderItems;
  }

  async findOneOrderItemsBy(
    where: Prisma.OrderItemWhereUniqueInput,
    include?: Prisma.OrderItemInclude,
  ) {
    const orderItem = await this.prisma.orderItem.findFirst({
      where,
      include,
    });
    return orderItem;
  }

  async findAllBy(
    where: Prisma.OrderWhereInput,
    include?: Prisma.OrderInclude,
  ) {
    const orders = await this.prisma.order.findMany({ where, include });
    return orders;
  }

  async findOneBy(
    where: Prisma.OrderWhereInput,
    include?: Prisma.OrderInclude,
  ) {
    const order = await this.prisma.order.findFirst({ where, include });
    return order;
  }
}
