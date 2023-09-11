import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IRequestUser } from 'src/shared/decorators/auth-user.decorator';
import { ProductService } from 'src/product/product.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: IRequestUser) {
    const product = await this.productService.findOneBy({
      id: createReviewDto.product_id,
    });
    if (!product) throw new BadRequestException('Product not found!');

    const review = await this.prismaService.review.create({
      data: {
        ...createReviewDto,
        user_id: user.id,
      },
    });
    return review;
  }

  async findAllBy(
    where: Prisma.ReviewWhereInput,
    include?: Prisma.ReviewInclude,
  ) {
    const reviews = await this.prismaService.review.findMany({
      where,
      include,
    });
    return reviews;
  }

  async findOneBy(
    where: Prisma.ReviewWhereUniqueInput,
    include?: Prisma.ReviewInclude,
  ) {
    const review = await this.prismaService.review.findFirst({
      where,
      include,
    });
    return review;
  }

  async updateOneBy(
    where: Prisma.ReviewWhereUniqueInput,
    updateReviewDto: UpdateReviewDto | Prisma.ReviewUpdateInput,
  ) {
    const review = await this.prismaService.review.update({
      where,
      data: updateReviewDto,
    });
    return review;
  }

  async remove(where: Prisma.ReviewWhereUniqueInput) {
    const review = await this.prismaService.review.delete({
      where,
    });
    return review;
  }
}
