import {
  Controller,
  Post,
  UseGuards,
  Get,
  Query,
  Param,
  NotFoundException,
  Body,
  Render,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { IRequestUser } from 'src/shared/decorators/auth-user.decorator';
import { User } from 'src/shared/decorators/auth-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { ConfigService } from '@nestjs/config';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async orders(
    @User() user: IRequestUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const cartItems = await this.ordersService.placeOrder(
      user.id,
      createOrderDto,
    );
    return {
      message: 'Order Completed',
      data: cartItems,
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @User() user: IRequestUser,
    @Query('page') currentPage: string,
    @Query('perPage') perPage: string,
  ) {
    const orders = await this.ordersService.findAllBy(
      { buyer_id: user.id },
      {
        buyer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            user_name: true,
          },
        },
        order_items: {
          include: { product: { select: { id: true, name: true } } },
        },
      },
    );

    return {
      message: 'Orders fetched successfully!',
      data: orders,
    };
  }

  @Get('success')
  //@Render('success')
  async successPayment(
    @Query('userId') userId: string,
    @Query('PayerID') payerId: string,
    @Query('paymentId') paymentId: string,
    @Query('orderId') orderId: string,
    @Res() res,
  ) {
    const paymentData = await this.ordersService.successPayment(
      userId,
      paymentId,
      payerId,
      orderId,
    );

    return res.redirect(
      `${this.configService.get<string>(
        'FRONTEND_ENDPOINT',
      )}/orderComplete/?orderId=${orderId}`,
    );
  }

  @Get('cancel')
  @Render('cancel')
  async cancelPayment() {
    return {
      message: 'Payment cancelled!',
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOneBy(@Param('id') orderId: string) {
    const order = await this.ordersService.findOneBy(
      { id: orderId },
      {
        buyer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            user_name: true,
          },
        },
        order_items: {
          include: { product: { select: { id: true, name: true } } },
        },
      },
    );
    if (!order) throw new NotFoundException('Order Not found!');

    return {
      message: 'Order fetche successfully!',
      data: order,
    };
  }
}
