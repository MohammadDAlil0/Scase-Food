import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetContributor = createParamDecorator(
  (data: string | undefined , ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
        return request.contributor[data];
    }
    return request.contributor;
  },
);