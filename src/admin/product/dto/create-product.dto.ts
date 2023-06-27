import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  base_price: number;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  images: string;

  @IsNumber()
  @IsOptional()
  status: number;
}
