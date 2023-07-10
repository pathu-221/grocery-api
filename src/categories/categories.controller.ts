import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { COMMON_STATUS } from 'src/shared/enums/status.enum';



@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }
  
  @Get()
 async findAll() {
    const categories = await this.categoriesService.findAllBy({ status: COMMON_STATUS.ACTIVE});
    return {
      message: "All categories fetched!",
      data: categories,
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOneBy({ id: id, status: COMMON_STATUS.ACTIVE });
    if (!category) throw new NotFoundException('Category not found!');

    return {
      message: "Category fetched successfully!",
      data: category
    }
  }

}
