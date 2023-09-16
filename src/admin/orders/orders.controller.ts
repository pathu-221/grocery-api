import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { Prisma } from '@prisma/client';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return {
      message: 'Not allowed',
    };
  }

  @Get()
  async findAllby() {
    const orders = await this.ordersService.findAllBy({});
    return {
      message: 'Orders fetched successfully!',
      data: orders,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOneBy({ id });
    if (!order) throw new NotFoundException('Order not found!');
    return {
      message: 'Order fetched successfully!',
      data: order,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const updateOrder = await this.ordersService.updateOneBy(
      { id },
      updateOrderDto,
    );

    return {
      message: 'Order updated successfully!',
      data: updateOrder,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
