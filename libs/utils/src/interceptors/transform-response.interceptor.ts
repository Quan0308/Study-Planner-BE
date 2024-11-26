import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { isNil } from "lodash";
import { Observable, map } from "rxjs";
import { ISuccessResponse } from "@app/types/interfaces";

type DataType = { data?: any };

const transform = <T extends DataType>(rawData: T): ISuccessResponse<T> => {
  const response: ISuccessResponse<T> = {
    statusCode: HttpStatus.OK,
    message: HttpStatus[HttpStatus.OK],
    data: null,
  };

  if (rawData && isNil(rawData.data)) {
    response.data = rawData;
  } else {
    response.data = rawData?.data ?? null;
  }

  return response;
};

@Injectable()
export class TransformResponseInterceptor<T extends DataType> implements NestInterceptor<T, ISuccessResponse<T> | T> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ISuccessResponse<T>> | Observable<T> {
    const bypassTransformResponse = this.reflector
      ? this.reflector.get<boolean>("bypass-transform-response", context.getHandler())
      : false;
    if (bypassTransformResponse) {
      return next.handle();
    }
    return next.handle().pipe(map((data) => transform(data)));
  }
}
