import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface Response<T> {
  status: number;
  msg: string;
  data: T;
}

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        return {
          status: statusCode === 201 || statusCode === 200 ? 1 : 0,
          msg: data.message || '',
          data: data.data,
        };
      }),
      catchError((err) => {
        console.log(err);
        return throwError(
          () =>
            new HttpException(
              {
                status: 0,
                msg: Array.isArray(err.response?.message)
                  ? err.response?.message[0]
                  : err.response?.message || 'Something went wrong!',
              },
              err.status,
            ),
        );
      }),
    );
  }
}
