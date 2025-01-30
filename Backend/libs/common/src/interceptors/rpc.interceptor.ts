import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { GlobalResponse } from "../constants";

@Injectable()
export class RpcResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getResponse();
        const response = ctx.getResponse();

        return next.handle().pipe(
            map(data => {
                if (data) {
                    response.statusCode = data.statusCode || response.statusCode; 
                    return GlobalResponse({
                        path: request.url || data.path  ,
                        data: (data.statusCode >= 400 ? null : data),
                        statusCode: response.statusCode,
                        messages: data.messages || ['Success'],
                    })
                }
            })
        );
    }
}