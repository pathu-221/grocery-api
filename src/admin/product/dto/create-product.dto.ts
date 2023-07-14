import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  base_price: number;

  @IsNumber()
  quantity: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  images: string[];

  @IsString()
  category_id: string;

  @IsNumber()
  @IsOptional()
  status: number;
}
