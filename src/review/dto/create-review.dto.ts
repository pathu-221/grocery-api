import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  title: string;

  @IsString()
  product_id: string;

  @IsNumber({ maxDecimalPlaces: 0 })
  rating: number;

  @IsString()
  comment: string;
}
