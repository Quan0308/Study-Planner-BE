import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { IErrorResponse } from "@app/types/interfaces";
import { isNil } from "lodash";
import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class ExceptionHandlerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) =>
        throwError(() => {
          this.logError(err);
          return this.transform(err);
        })
      )
    );
  }

  logError = (err: any) => {
    const { response, stack } = err;
    let { message } = err;
    if (response) {
      message = `${message} - ${JSON.stringify(response)}`;
    }
    Logger.error(message, stack, "ExceptionHandlerInterceptor");
  };

  transform = (err: any): HttpException => {
    const response: IErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
    };

    const { message, stack } = err;
    if (!isNil(message)) {
      response.message = message;
    }

    if (err instanceof HttpException) {
      const errResponse = err.getResponse();
      response.statusCode = err.getStatus();
      if (typeof errResponse === "string") {
        response.message = errResponse;
      }
    }

    const newErr = new HttpException(response, response.statusCode);
    newErr.stack = stack;
    return newErr;
  };
}
