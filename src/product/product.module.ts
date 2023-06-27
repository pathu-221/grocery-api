import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { HelperService } from 'src/shared/services/helper/helper.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, HelperService]
})
export class ProductModule {}
