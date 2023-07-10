import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {

  constructor(private readonly prismaService: PrismaService){}

  async findAllBy(where?: Prisma.CategoryWhereInput) {
    const categories = await this.prismaService.category.findMany({ where });
    return categories;
  }

  async findOneBy(where: Prisma.CategoryWhereInput) {
    const category = await this.prismaService.category.findFirst({ where });
    return category;
  }
}
