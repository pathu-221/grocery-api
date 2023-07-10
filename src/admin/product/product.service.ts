import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { HelperService } from 'src/shared/services/helper/helper.service';
import { IRequestOptions } from 'src/shared/interfaces/common.interface';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: HelperService,
  ) {}

  /**
   *
   * @param createProductDto
   * @param userId
   * @returns new product which is created
   */

  async create(createProductDto: CreateProductDto) {
    const categoryId = createProductDto.category_id;
    const { category_id, ...productToAdd } = createProductDto;

    const product = await this.prisma.product.create({
      data: {
        ...productToAdd,
        category: { connect: { id: category_id } }
      }
    });

    return product;
  }

  async getPaginatedData(currentPage = 1, perPage = 25) {
    const paginatedData = await this.helper.getPaginatedData(
      'Product',
      currentPage,
      perPage,
    );
    return paginatedData;
  }

  async findAll(include?: Prisma.ProductInclude) {
    const products = await this.prisma.product.findMany({ include });
    return products;
  }

  async findAllBy(
    where: Prisma.ProductWhereInput,
    include?: Prisma.ProductInclude,
  ) {
    const products = await this.prisma.product.findMany({ where, include });
    return products;
  }

  async findOne(id: string, include?: Prisma.ProductInclude) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include,
    });
    return product;
  }

  async findOneBy(
    where: Prisma.ProductWhereInput,
    include?: Prisma.ProductInclude,
  ) {
    const product = await this.prisma.product.findFirst({ where, include });

    return product;
  }

  /**
   *
   * @param id id of product to update
   * @param updateProductDto
   * @returns updated product
   */
  async update(id: string, updateProductDto: UpdateProductDto | Prisma.ProductUpdateInput, requestOptions?: IRequestOptions) {
    const client = requestOptions?.transaction || this.prisma;
    const updatedProduct = await client.product.update({
      where: { id: id },
      data: updateProductDto,
    });

    return updatedProduct;
  }

  async removeOneBy(where: Prisma.ProductWhereUniqueInput) {
    const product = await this.prisma.product.delete({ where });

    return product;
  }
}
