import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, BadRequestException } from "@nestjs/common";
import { of } from "rxjs";
import { UniqueConstraintError, ValidationError, ConnectionRefusedError, ForeignKeyConstraintError } from "sequelize";

@Catch()
export class MicroserviceExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToRpc();
        let path = ctx.getContext().args[0] || 'unknown';
        let messages = Array.isArray(exception.message) ? exception.message : exception.message ? [exception.message] : ['Interval Error'];
        let statusCode = exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        let data = null;

        if (exception instanceof ConnectionRefusedError) {
          messages = ['Unable to connect to the database'];
        }
        else if (exception instanceof UniqueConstraintError || exception instanceof ValidationError) {
          statusCode = HttpStatus.BAD_REQUEST,
          messages = exception.errors.map((e: any) => e.message);
        }
        else if (exception instanceof ForeignKeyConstraintError) {
          path = exception.stack;
          statusCode = HttpStatus.BAD_REQUEST;
          messages = [`Can't find the ID in the ${exception.table}`]
        }
        else if (exception instanceof BadRequestException) {
          path = exception.stack;
          statusCode = HttpStatus.BAD_REQUEST;
          messages = [exception.message];
        }
        console.log(exception.constructor.name)

        return of({
          path,
          messages,
          statusCode
        });
    }
}