import { Injectable } from '@nestjs/common'; 
import { PrismaService } from 'src/prisma/prisma.service';
import { HelperService } from 'src/shared/services/helper/helper.service';
import { Prisma } from '@prisma/client';


@Injectable()
export class ProductService {

  constructor(private readonly prismaService: PrismaService,
  private readonly helperService: HelperService) { }

  async getPaginatedData(currentPage = 1, perPage = 25) {
    const paginatedData = await this.helperService.getPaginatedData(
      'Product',
      currentPage,
      perPage,
    );
    return paginatedData;
  }

  async findAll(include?: Prisma.ProductInclude) {
    const products = await this.prismaService.product.findMany({ include });
    return products;
  }

  async findAllBy(
    where: Prisma.ProductWhereInput,
    include?: Prisma.ProductInclude,
    orderBy?: Prisma.ProductOrderByWithRelationInput
  ) {
    const products = await this.prismaService.product.findMany({ where, include, orderBy });
    return products;
  }

  async findOne(id: string, include?: Prisma.ProductInclude) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include,
    });
    return product;
  }

  async findOneBy(
    where: Prisma.ProductWhereInput,
    include?: Prisma.ProductInclude,
  ) {
    const product = await this.prismaService.product.findFirst({ where, include });

    return product;
  }
}
