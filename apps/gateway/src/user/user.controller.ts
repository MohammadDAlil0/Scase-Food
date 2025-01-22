import { Body, Controller, Get, HttpException, Inject, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ChangeRoleDecorator, ChangeStatusDecorator, ChangeStatusOfOrder, CraeteOrderDecorator, GetAllActiveContributors, GetAllUsersDecorator, GetMyOrders, getOrdersOfContributionDecorator, GetTopContributors, LoginDecorators, SignupDecorators, SubmitOrderDecorator } from './decorators/user-appliers.decorator';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { GetUser } from './decorators/get-user.decortator';
import { User } from '@app/common/models';
import { CreateUserDto, LoginDto, ChangeRoleDto, ChangeStatusDto } from '@app/common/dto/userDtos';
import { lastValueFrom } from 'rxjs';
import { FindAllUsersDto } from '@app/common/dto/userDtos/find-all-users.dto';
import { GetContributor } from './decorators/get-contributor';
import { PaginationDto } from '@app/common/dto/globalDtos';

@Controller('user')
export class UserController {
    constructor(
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    ) {}

    @Post('signup')
    @SignupDecorators()
    async signup(@Body() createUserDto: CreateUserDto) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'signup' }, createUserDto),
        );
    }

    @Post('login')
    @LoginDecorators()
    async login(@Body() loginDto: LoginDto) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'login' }, loginDto),
        );
    }

    @Get('getAllUsers')
    @GetAllUsersDecorator()
    async getAllUsers(@Query() filter: FindAllUsersDto) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'GetAllUsers' }, filter)
        )
    }

    @Put('changeRole')
    @ChangeRoleDecorator()
    async changeRole(@Body() changeRoleDto: ChangeRoleDto) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'changeRole' }, changeRoleDto)
        )
    }

    @Put('changeStatus')
    @ChangeStatusDecorator()
    async changeStatus(@GetUser('id') userId: string, @Body() changeStatusDto: ChangeStatusDto) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'changeStatus' }, {
                userId,
                ...changeStatusDto
            })
        );
    }

    @Post('createOrder/:contributorId')
    @CraeteOrderDecorator()
    async createOrder(@Param('contributorId') contributorId: string, @GetUser('id') createdBy: string, @GetContributor('numberOfContributions') numberOfContributions: number) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'createOrder' }, {
                createdBy,
                contributorId,
                numberOfContributions
            })
        );
    }

    @Put('submitOrder/:orderId')
    @SubmitOrderDecorator()
    async submitOrder(@Param('orderId') orderId: string) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'submitOrder' }, orderId)
        );
    }

    @Get('getAllActiveContributors')
    @GetAllActiveContributors()
    async getAllActiveContributors(@Query() filter: PaginationDto) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'getAllActiveContributors' }, filter)
        );
    }

    @Put('changeStatusOfOrder/:orderId')
    @ChangeStatusOfOrder()
    async changeStatusOfOrder(@Param('orderId') orderId: string) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'changeStatusOfOrder' }, orderId)
        );
    }
    
    @Get('GetTopcontributors')
    @GetTopContributors()
    async getTopContributors(@Query() filter: PaginationDto) {
        return lastValueFrom(
            this.natsClient.send({ cmd: 'getTopContributors' }, filter)
        );
    }

    @Get('GetMyOrders')
    @GetMyOrders()
    async getMyOrders(@GetUser() curUser: User) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'getMyOrders' }, curUser.id)
        );
    }

    @Get('getOrdersOfContribution')
    @getOrdersOfContributionDecorator()
    async getOrdersOfContribution(@Query() filter: PaginationDto, @GetUser() user: User) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'getOrdersOfContribution' }, {
                ...filter,
                ...user.dataValues
            })
        );
    }
}