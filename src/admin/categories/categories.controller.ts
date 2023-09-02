import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('admin/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(__dirname, '../../../../', 'public'),
        filename: (req, file, cb) => {
          const filename =
            new Date().getTime().toString() +
            '.' +
            file.originalname.split('.')[1];
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    const category = await this.categoriesService.create(
      createCategoryDto,
      file.filename,
    );

    return {
      message: 'Category added successfully!',
      data: category,
    };
  }

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();

    return {
      message: 'All categories fetched!',
      data: categories,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOneBy({ id: id });

    if (!category) throw new NotFoundException('Category not found!');

    return {
      message: 'Category fetched successfully!',
      data: category,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.updateOneBy(
      { id: id },
      updateCategoryDto,
    );

    return {
      message: 'Category updated successfully!',
      data: category,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);

    return {
      message: 'Category deleted successfully!',
    };
  }
}
