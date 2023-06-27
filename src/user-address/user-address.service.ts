import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAddressDto: CreateAddressDto, userId: string) {
    const address = await this.prisma.userAddress.create({
      data: {
        ...createAddressDto,
        user_id: userId,
      },
    });
    return address;
  }

  async findAllBy(
    where: Prisma.UserAddressWhereInput,
    include?: Prisma.UserAddressInclude,
  ) {
    const addresses = await this.prisma.userAddress.findMany({
      where,
      include,
    });
    return addresses;
  }

  async findOneBy(
    where: Prisma.UserAddressWhereUniqueInput,
    include?: Prisma.UserAddressInclude,
  ) {
    const address = await this.prisma.userAddress.findFirst({ where, include });
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const updatedAddress = await this.prisma.userAddress.update({
      where: { id },
      data: updateAddressDto,
    });
    return updatedAddress;
  }

  async delete(id: string) {
    const deletedAddress = await this.prisma.userAddress.delete({
      where: { id },
    });
    return deletedAddress;
  }
}
