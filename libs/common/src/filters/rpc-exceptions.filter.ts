import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { of } from "rxjs";
import { UniqueConstraintError, ValidationError, ConnectionRefusedError } from "sequelize";

@Catch(UniqueConstraintError, ValidationError, ConnectionRefusedError)
export class SequelizeExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToRpc();
        let path = ctx.getContext().args || 'unknown';
        let messages = ['Sequelize Interval Error'];
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let data = null;

        if (exception instanceof ConnectionRefusedError) {
          messages = ['Unable to connect to the database'];
        }
        else if (exception instanceof UniqueConstraintError || exception instanceof ValidationError) {
          statusCode = HttpStatus.BAD_REQUEST,
          messages = exception.errors.map((e: any) => e.message);
        }
        console.log('Roc error');

        return of({
          path,
          messages,
          statusCode
        });
    }
}

@Catch()
export class testException implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToRpc();
        let path = ctx.getContext().args || 'unknown';
        let messages = ['Sequelize Interval Error'];
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let data = null;

        console.log(exception.constructor.name)

        return of({
          path,
          messages,
          statusCode
        })
    }
}
