import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, verify } from 'jsonwebtoken';
import { userRoles } from '../enums/roles.enum';

export class RoleGuard implements CanActivate {
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const roleHeader = request.headers.role;

      if (!roleHeader)
        throw new HttpException({ status: 0, msg: 'Not allowed' }, 403);
      if (roleHeader == userRoles.ADMIN) return true;
      else
        throw new HttpException({ status: 0, msg: 'Forbidden resource!' }, 403);
    } catch (err) {
      console.log(err);
      throw new HttpException(err.response, err.status);
    }
  }
}
