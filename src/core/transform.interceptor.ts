import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE, SKIP_TRANSFORM_KEY } from 'src/decorator/customize';

export interface Response<T> {
    statusCode: number;
    message?: string;
    data: any;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    constructor(private reflector: Reflector) { }
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        const skip = this.reflector.get<boolean>(SKIP_TRANSFORM_KEY, context.getHandler());
        if (skip) {
            return next.handle(); // Skip transformation
        }
        return next
            .handle()
            .pipe(
                map((data) => ({
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message: this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || '',
                    data: data
                })),
            );
    }
}