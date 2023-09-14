import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoriesModule } from './categories/categories.module';
import { DashboardModule } from './dashboard/dashboard.module';


@Module({
  imports: [ProductModule, CategoriesModule, DashboardModule]
})
export class AdminModule {}
