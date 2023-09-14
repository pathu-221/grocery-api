import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order } from '@prisma/client';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  findAll() {
    return `This action returns all dashboard`;
  }

  async getDashBoardData() {
    const currentYear = new Date().getFullYear();
    const totalSales = await this.prismaService.order.aggregate({
      _sum: { grand_total: true },
      where: {
        created_at: {
          gte: new Date(currentYear, 0, 1),
        },
      },
    });
    const totalOrders = await this.prismaService.order.count();
    const averageReviews = await this.prismaService.review.aggregate({
      _avg: { rating: true },
      where: {
        created_at: {
          gte: new Date(currentYear, 0, 1),
        },
      },
    });
    const orders = await this.prismaService.order.findMany({
      where: {
        created_at: {
          gte: new Date(currentYear, 0, 1),
        },
      },
    });
    const ordersByMonth = this.groupOrdersByMonth(orders);
    return {
      totalSales: totalSales._sum.grand_total || 0,
      totalOrders,
      averageReviews: averageReviews._avg.rating,
      ordersByMonth,
    };
  }

  groupOrdersByMonth(orders: Order[]) {
    const monthlySum: { [key: string]: number } = {};
    orders.forEach((order) => {
      const createdAt = new Date(order.created_at);
      const key = months[createdAt.getMonth()];

      if (!monthlySum[key]) {
        monthlySum[key] = 0;
      }
      monthlySum[key] += 1;
    });
    return monthlySum;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
