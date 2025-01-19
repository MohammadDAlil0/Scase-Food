import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ConnectionRefusedError, UniqueConstraintError, ValidationError } from 'sequelize';
import { GlobalResponse } from '../constants';
import { RpcException } from '@nestjs/microservices';

@Catch(BadRequestException)
export class badRequestExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(exception.getStatus()).json(GlobalResponse({
      path: request.url,
      statusCode: exception.getStatus(),
      messages: (exception.getResponse() as any).message || 'Bad Exception'
    }));
  }
}

@Catch(HttpException)
export class httpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(exception.constructor.name);
    response.status(exception.getStatus()).json(GlobalResponse({
      path: request.url,
      statusCode: exception.getStatus(),
      messages: [exception.message]
    }));
  }
}

@Catch(UniqueConstraintError, ValidationError, ConnectionRefusedError)
export class SequelizeExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToRpc();
        let path = ctx.getContext().args || 'unknown';
        let messages = ['Sequelize Interval Error'];
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let data = exception;

        if (exception instanceof ConnectionRefusedError) {
          messages = ['Unable to connect to the database'];
        }
        else if (exception instanceof UniqueConstraintError || exception instanceof ValidationError) {
          statusCode = HttpStatus.BAD_REQUEST,
          messages = exception.errors.map((e: any) => e.message);
        }

        const x = GlobalResponse({
            path,
            messages,
            statusCode,
            data
        });
        throw new RpcException(x);
    }
}