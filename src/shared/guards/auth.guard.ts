import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Inject,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { JwtPayload, verify } from 'jsonwebtoken';
  
  export class AuthGuard implements CanActivate {
    constructor(@Inject(ConfigService) private configService: ConfigService) {}
  
    canActivate(context: ExecutionContext) {
      try {
        const request = context.switchToHttp().getRequest();
  
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
          throw new BadRequestException('Token not found!');
        }
  
        const token = authorizationHeader.split(' ')[1];
  
        const decoded = verify(
          token,
          this.configService.get<string>('JWT_SECRET'),
        );
  
        request.user = (decoded as JwtPayload).user;
        return request.user.id;
      } catch (err) {
        console.log(err);
        throw new BadRequestException('Authentication failed!');
      }
    }
  }