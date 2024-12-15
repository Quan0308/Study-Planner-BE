import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { isNil } from "lodash";
import { Observable, map } from "rxjs";
import { ISuccessResponse } from "@app/types/interfaces";
import { plainToInstance } from "class-transformer";
import { SERIALIZE_KEY } from "@app/types/constants";

type DataType = { data?: any };

const transform = <T extends DataType>(rawData: T, cls?: new () => any): ISuccessResponse<T> => {
  const response: ISuccessResponse<T> = {
    statusCode: HttpStatus.OK,
    message: HttpStatus[HttpStatus.OK],
    data: null,
  };

  if (!isNil(rawData) && !isNil(cls)) {
    response.data = plainToInstance(cls, rawData, { excludeExtraneousValues: true });
  } else {
    response.data = rawData;
  }

  return response;
};

@Injectable()
export class TransformResponseInterceptor<T extends DataType> implements NestInterceptor<T, ISuccessResponse<T> | T> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ISuccessResponse<T>> | Observable<T> {
    const handler = context.getHandler();
    const bypassTransformResponse = this.reflector
      ? this.reflector.get<boolean>("bypass-transform-response", context.getHandler())
      : false;
    if (bypassTransformResponse) {
      return next.handle();
    }
    const cls = this.reflector.get<new () => any>(SERIALIZE_KEY, handler);
    return next.handle().pipe(map((data) => transform(data, cls)));
  }
}
