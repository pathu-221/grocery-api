import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IRequestUser, User } from 'src/shared/decorators/auth-user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('admin/product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @UseGuards(StoreOwnerGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const data = await this.productService.create(createProductDto);
    return {
      message: 'Product Added Successfully!',
      data: data,
    };
  }

  @Get()
  async findAll(
    @Query('page') currentPage: string,
    @Query('perPage') perPage: string,
  ) {
    const products = await this.productService.findAllBy(
      {},
      { category: { select: { name: true, id: true } } },
    );
    return {
      message: 'Products fetched successfully!',
      data: products,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);

    if (!product) throw new NotFoundException('Product Not found');

    return {
      message: 'Product fetched successfully!',
      data: product,
    };
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.update(id, updateProductDto);

    return {
      message: 'Product Updated',
      data: product,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.productService.removeOneBy({ id: id });
    return {
      message: 'Product deleted',
      data: product,
    };
  }
}
