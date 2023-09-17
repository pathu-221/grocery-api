import { IsEnum, IsString } from 'class-validator';
import { orderStatus } from 'src/shared/enums/order-status.enum';

export class CreateOrderDto {
  @IsString()
  @IsEnum(orderStatus, { each: true })
  status: string;
}
