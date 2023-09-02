import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { COMMON_STATUS } from 'src/shared/enums/status.enum';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, filename: string) {
    const category = await this.prismaService.category.findFirst({
      where: { name: createCategoryDto.name },
    });

    if (category) throw new ConflictException('Category already exists');

    const newCategory = await this.prismaService.category.create({
      data: { name: createCategoryDto.name, image: filename },
    });

    return newCategory;
  }

  async findAll() {
    const categories = await this.prismaService.category.findMany();

    return categories;
  }

  async findOneBy(
    where: Prisma.CategoryWhereUniqueInput,
    include?: Prisma.CategoryInclude,
  ) {
    const category = await this.prismaService.category.findFirst({
      where,
      include,
    });

    return category;
  }

  async updateOneBy(
    where: Prisma.CategoryWhereUniqueInput,
    data: UpdateCategoryDto | Prisma.CategoryUpdateInput,
  ) {
    const category = await this.prismaService.category.update({ where, data });
  }

  async remove(id: string) {
    const deletedCategory = await this.prismaService.category.update({
      where: {
        id: id,
      },
      data: {
        status: COMMON_STATUS.INACTIVE,
      },
    });

    return deletedCategory;
  }
}
