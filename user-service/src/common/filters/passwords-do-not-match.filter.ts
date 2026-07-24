import * as grpc from "@grpc/grpc-js";
import { ArgumentsHost, Catch, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";
import { PasswordsDoNotMatchException } from "@/users/exceptions/passwords-do-not-match.exception";

@Catch(PasswordsDoNotMatchException)
export class PasswordsDoNotMatchFilter implements RpcExceptionFilter<PasswordsDoNotMatchException> {
  catch(exception: PasswordsDoNotMatchException, _host: ArgumentsHost): Observable<never> {
    return throwError(
      (): RpcException =>
        new RpcException({
          code: grpc.status.INVALID_ARGUMENT,
          message: exception.message,
        }),
    );
  }
}
