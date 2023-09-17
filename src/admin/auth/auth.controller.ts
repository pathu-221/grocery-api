import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { IRequestUser, User } from 'src/shared/decorators/auth-user.decorator';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get()
  async authenticate(@User() requesUser: IRequestUser) {
    const user = await this.authService.authenticate(requesUser.id);

    return {
      message: 'Token verified',
      data: user,
    };
  }

  @Post('/login')
  async login(@Body() loginCreds: LoginDto) {
    const loginData = await this.authService.login(loginCreds);
    return {
      message: 'Logged in successfully',
      data: loginData,
    };
  }
}
