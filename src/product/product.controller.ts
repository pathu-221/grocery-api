import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(
    @Query('page') currentPage: string,
    @Query('perPage') perPage: string,
  ) {
    const products = await this.productService.findAllBy({});
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
}
