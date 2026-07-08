import * as grpc from "@grpc/grpc-js";
import { ArgumentsHost, Catch, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";
import { UserAlreadyExistsException } from "@/users/exceptions/user-already-exists.exception";

@Catch(UserAlreadyExistsException)
export class UserAlreadyExistsFilter implements RpcExceptionFilter<UserAlreadyExistsException> {
  catch(exception: UserAlreadyExistsException, _host: ArgumentsHost): Observable<never> {
    return throwError(
      (): RpcException =>
        new RpcException({
          code: grpc.status.ALREADY_EXISTS,
          message: exception.message,
        }),
    );
  }
}
