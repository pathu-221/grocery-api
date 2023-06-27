import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Cart } from '@prisma/client';
import { HelperService } from 'src/shared/services/helper/helper.service';
import { IRequestOptions } from 'src/shared/interfaces/common.interface';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: HelperService,
  ) {}

  /**
   * @param createCartDto
   * @param userId
   * @returns cartItem which is added
   */
  async create(createCartDto: CreateCartDto, userId: string) {
    let cartItem: Cart;

    const item = await this.findOneBy(
      { product_id: createCartDto.product_id, user_id: userId },
      { product: true },
    );

    if (!item) {
      cartItem = await this.prisma.cart.create({
        data: { user_id: userId, ...createCartDto },
      });
      return cartItem;
    }

    //if cartItem already exists it increases its quantity
    //if item exists verify the stock and then add to cart
    if (item.product.quantity === 0)
      throw new ConflictException('Product is out of stock');

    if (createCartDto.quantity > item.product.quantity)
      throw new ConflictException('Not enough stock available');

    cartItem = await this.update(
      { id: item.id },
      { quantity: createCartDto.quantity + item.quantity },
    );

    return cartItem;
  }

  /**
   *
   * @param takes userid
   * @returns all cart items
   */
  async findAll(userId: string, include?: Prisma.CartInclude) {
    const cartItems = await this.prisma.cart.findMany({
      where: { user_id: userId },
      include,
    });
    return cartItems;
  }

  async getPaginatedData(userId: string, currentPage = 1, perPage = 25) {
    const paginatedData = await this.helper.getPaginatedData(
      'Cart',
      currentPage,
      perPage,
      { user_id: userId },
    );
    return paginatedData;
  }

  async findOneBy(where: Prisma.CartWhereInput, include?: Prisma.CartInclude) {
    const cartItem = await this.prisma.cart.findFirst({ where, include });
    return cartItem;
  }

  async update(
    where: Prisma.CartWhereUniqueInput,
    updateCartDto: UpdateCartDto,
  ) {
    //todo: implement stock availability also when updating
    const updatedCart = await this.prisma.cart.update({
      where,
      data: updateCartDto,
    });

    return updatedCart;
  }

  async deleteAllUserCartItems(userId: string, requestOptions?: IRequestOptions) {
    const client = requestOptions?.transaction || this.prisma;
    
    const items = await client.cart.deleteMany({
      where: { user_id: userId },
    });
    return items;
  }

  async delete(cartId: string) {
    const item = await this.prisma.cart.delete({ where: { id: cartId } });

    if (!item) throw new NotFoundException('Cart Item not found!');

    return item;
  }
}
