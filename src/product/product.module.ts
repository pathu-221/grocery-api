import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { HelperService } from 'src/shared/services/helper/helper.service';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [ReviewModule],
  controllers: [ProductController],
  providers: [ProductService, HelperService],
  exports: [ProductService]
})
export class ProductModule {}
