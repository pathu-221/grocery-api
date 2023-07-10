import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoriesModule } from './categories/categories.module';


@Module({
  imports: [ProductModule, CategoriesModule]
})
export class AdminModule {}
