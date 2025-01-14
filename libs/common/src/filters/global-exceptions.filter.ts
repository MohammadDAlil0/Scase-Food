import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ConnectionRefusedError, UniqueConstraintError, ValidationError } from 'sequelize';
import { GlobalResponse } from '../constants/responses';
import { RpcException } from '@nestjs/microservices';

@Catch(BadRequestException)
export class badRequestExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log('BadRequestionException - ----------------------------');
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
    console.log('HttpException - ----------------------------');
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
        const response = ctx.getContext();
        if (exception instanceof ConnectionRefusedError) {
            response.send({
                statusCode: 500,
                message: 'Unable to connect to the database'
            })
        }

        const errorMessages = exception.errors.map((e: any) => e.message);
        console.log(errorMessages);

        response.send({
            statusCode: 400,
            message: 'validation error'
        })
    }
}