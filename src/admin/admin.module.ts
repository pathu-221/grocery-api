import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';


@Module({
  imports: [ProductModule]
})
export class AdminModule {}
