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
      messages: (exception.getResponse() as any).message || 'Bad Exception',
      data: null
    }));
  }
}

@Catch(HttpException)
export class httpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    response.status(exception.getStatus()).json(GlobalResponse({
      path: request.url,
      statusCode: exception.getStatus(),
      messages: [exception.message],
      data: null
    }));
  }
}

