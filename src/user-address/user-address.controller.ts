import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './user-address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { IRequestUser, User } from 'src/shared/decorators/auth-user.decorator';

@Controller('address')
@UseGuards(AuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @User() user: IRequestUser,
  ) {
    const address = await this.addressService.create(createAddressDto, user.id);
    return {
      message: 'Address created Successfully!',
      data: address,
    };
  }

  @Get()
  async findAll(@User() user: IRequestUser) {
    const addresses = await this.addressService.findAllBy({ user_id: user.id });

    return {
      message: 'Users all saved addresses!',
      data: addresses,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const address = await this.addressService.findOneBy({ id: id });
    return {
      message: 'Address found!',
      data: address,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const updatedAddress = await this.addressService.update(
      id,
      updateAddressDto,
    );
    return {
      message: 'Address Updated Successfully!',
      data: updatedAddress,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedAddress = await this.addressService.delete(id);
    return {
      message: 'Address Deleted Successfully!',
      data: deletedAddress,
    };
  }
}
