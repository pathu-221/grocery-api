import { Module } from '@nestjs/common';
import { AddressService } from './user-address.service';
import { AddressController } from './user-address.controller';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService]
})
export class AddressModule {}
