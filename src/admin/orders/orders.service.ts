import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async findAllBy(
    where: Prisma.OrderWhereInput,
    include?: Prisma.OrderInclude,
  ) {
    const orders = await this.prismaService.order.findMany({ where, include });
    return orders;
  }

  async findOneBy(
    where: Prisma.OrderWhereUniqueInput,
    include?: Prisma.OrderInclude,
  ) {
    const order = await this.prismaService.order.findFirst({ where, include });
    return order;
  }

  async updateOneBy(
    where: Prisma.OrderWhereUniqueInput,
    updateOrderDto: UpdateOrderDto | Prisma.OrderUpdateInput,
  ) {
    const order = await this.prismaService.order.update({
      where,
      data: updateOrderDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
