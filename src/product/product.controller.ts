import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(
    @Query('category') category: string,
    @Query('sortBy') sortBy: string,
    @Query('page') currentPage: string,
    @Query('perPage') perPage: string,
  ) {
    const categories = category.length
      ? category.replace(/\s/g, '').split(',')
      : [];
    console.log({ categories });
    let orderBy: any;
    if (sortBy === 'asc' || sortBy === 'desc') {
      orderBy = {
        base_price: sortBy,
      };
    } else if (sortBy === 'latest') orderBy = { created_at: 'desc' };

    const products = await this.productService.findAllBy(
      {
        category: {
          name: categories.length ? { in: categories } : {},
        },
      },
      undefined,
      orderBy,
    );
    return {
      message: 'Products fetched successfully!',
      data: products,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOneBy(
      { id },
      {
        category: {
          select: {
            name: true,
          },
        },
      },
    );

    if (!product) throw new NotFoundException('Product Not found');

    return {
      message: 'Product fetched successfully!',
      data: product,
    };
  }
}
