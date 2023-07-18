import {
  BadRequestException,
  Body,
  Controller,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { IRequestUser, User } from 'src/shared/decorators/auth-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { compare, hash } from 'bcrypt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Put()
  async update(@User() user: IRequestUser,@Body() updateUserDto: UpdateUserDto) {
    await this.userService.updateOneBy({ id: user.id }, updateUserDto);

    return {
      message: 'User updated successfully!',
    };
  }

  @UseGuards(AuthGuard)
  @Put('/password')
  async updatePassword(
    @User() reqUser: IRequestUser,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.userService.findOne(reqUser.id);
    const match = await compare(updatePasswordDto.old_password, user.password);
    if (!match) throw new BadRequestException('Incorrect Password');

    const hashedPassword = await hash(updatePasswordDto.new_password, 10);

    await this.userService.updateOneBy({ id: reqUser.id }, { password: hashedPassword });

    return {
      message: "Password updated successfully!"
    }

  }
}
