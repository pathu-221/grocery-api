import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    const newUser = await this.prisma.user.create({ data: createUserDto });

    return newUser;
  }

  async updateOneBy(where: Prisma.UserWhereUniqueInput, updateUserDto: UpdateUserDto | Prisma.UserUpdateInput) {
    const user = await this.prisma.user.update({ where, data: updateUserDto });
    return user;
  }

  async findOne(id: string, include?: Prisma.UserInclude) {
    const user = await this.prisma.user.findUnique({ where: { id }, include });
    return user;
  }

  async findOneBy(where: Prisma.UserWhereInput, include?: Prisma.UserInclude) {
    const user = await this.prisma.user.findFirst({ where, include });
    return user;
  }
}
