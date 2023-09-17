import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoriesModule } from './categories/categories.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ProductModule,
    CategoriesModule,
    DashboardModule,
    OrdersModule,
    AuthModule,
  ],
})
export class AdminModule {}
