import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { IRequestUser } from 'src/shared/decorators/auth-user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, user: IRequestUser) {
    const review = await this.prismaService.review.create({
      data: {
        title: createReviewDto.title,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        user: {
          connect: { id: user.id },
        },
        product: {
          connect: { id: createReviewDto.product_id },
        },
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

  async getProductRating(productId: string) {
    const rating = await this.prismaService.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        product_id: productId,
      },
    });
    return rating._avg.rating || 0;
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
