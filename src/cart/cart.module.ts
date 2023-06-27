import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { HelperService } from 'src/shared/services/helper/helper.service';

@Module({
  controllers: [CartController],
  providers: [CartService, HelperService],
  exports: [CartService]
})
export class CartModule {}
