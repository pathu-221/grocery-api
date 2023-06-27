import { Module } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
import { ProductModule } from 'src/admin/product/product.module';
import { HelperService } from 'src/shared/services/helper/helper.service';
import { PaypalService } from 'src/shared/services/paypal/paypal.service';
import { AddressModule } from 'src/user-address/user-address.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    CartModule,
    AddressModule,
    ProductModule,
  ],
  controllers: [OrdersController],
  providers: [
    PaypalService, HelperService, OrdersService
  ]
})
export class OrdersModule {}
