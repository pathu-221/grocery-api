import { IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  title: string;

  @IsString()
  product_id: string;

  @IsString()
  comment: string;
}
