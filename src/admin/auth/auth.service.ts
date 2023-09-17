import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { userRoles } from 'src/shared/enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginCredsDto: LoginDto) {
    const user = await this.userService.findOneBy({
      email: loginCredsDto.email,
      role: userRoles.ADMIN,
    });

    if (!user) throw new NotFoundException('User not found!');

    const match = await compare(loginCredsDto.password, user.password);
    if (!match) throw new BadRequestException('Incorrect Password');

    const token = sign(
      { user: { id: user.id } },
      this.configService.get<string>('JWT_SECRET'),
    );

    return { user, token };
  }

  async authenticate(id: string) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException('User Not Found');

    return user;
  }

}
