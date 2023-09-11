import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { IRequestUser, User } from 'src/shared/decorators/auth-user.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @User() user: IRequestUser,
  ) {
    const data = await this.reviewService.create(createReviewDto, user);
    return {
      message: 'Review added successfully!',
      data: data,
    };
  }

  @Get()
  async findAll(@Query('product_id') product_id: string) {
    console.log({ product_id });
    const data = await this.reviewService.findAllBy(
      product_id ? { product_id } : {},
      {
        user: {
          select: {
            first_name: true,
            last_name: true,
            created_at: true,
          },
        },
      },
    );
    return {
      message: 'Review fetched successfully!',
      data: data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.reviewService.findOneBy({ id });
    if (!data) throw new NotFoundException('Review not found!');
    return {
      message: 'Review fetched successfully!',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const data = await this.reviewService.updateOneBy({ id }, updateReviewDto);
    return {
      message: 'Review updated successfully!',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.reviewService.remove({ id });
    return {
      messgage: 'Review removed successfully!',
    };
  }
}
