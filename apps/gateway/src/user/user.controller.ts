import { Body, Controller, Get, HttpException, Inject, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ChangeRoleDecorator, ChangeStatusDecorator, ChangeStatusOfOrder, CraeteOrderDecorator, GetAllActiveContributors, GetAllUsersDecorator, GetMyOrders, GetTopContributors, LoginDecorators, SignupDecorators, SubmitOrderDecorator } from './decorators/user-appliers.decorator';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { GetUser } from './decorators/get-user.decortator';
import { User } from '@app/common/models';
import { CreateUserDto, LoginDto, ChangeRoleDto, ChangeStatusDto } from '@app/common/dto/userDtos';
import { lastValueFrom } from 'rxjs';
import { FindAllUsersDto } from '@app/common/dto/userDtos/find-all-users.dto';

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
    async changeStatus(@GetUser() curUser: User, @Body() changeStatusDto: ChangeStatusDto) {
        try {
            return await this.natsClient.send({ cmd: 'changeStatus' }, {
                curUser,
                ...changeStatusDto
            }).toPromise();
        } catch(error) {
            return error;
        }
    }

    @Post('createOrder/:contributorId')
    @CraeteOrderDecorator()
    async createOrder(@Param('contributorId') contributorId: string, @GetUser() curUser: User) {
        try {
            return await this.natsClient.send({ cmd: 'createOrder' }, {
                createdBy: curUser.id,
                contributorId

            }).toPromise();
        } catch(error) {
            return error;
        }
    }

    @Put('submitOrder/:orderId')
    @SubmitOrderDecorator()
    async submitOrder(@Param('orderId') orderId: string) {
        try {
            return await this.natsClient.send({ cmd: 'submitOrder' }, orderId).toPromise();
        } catch(error) {
            return error;
        }
    }

    @Get('getAllActiveContributors')
    @GetAllActiveContributors()
    async getAllActiveContributors() {
        try {
            return await this.natsClient.send({ cmd: 'getAllActiveContributors' }, {}).toPromise();
        } catch(error) {
            return error;
        }
    }

    @Put('changeStatusOfOrder/:orderId')
    @ChangeStatusOfOrder()
    async changeStatusOfOrder(@Param('orderId') orderId: string) {
        try {
            return await this.natsClient.send({ cmd: 'changeStatusOfOrder' }, orderId).toPromise();
        } catch(error) {
            return error;
        }
    }
    
    @Get('GetTopcontributors')
    @GetTopContributors()
    async getTopContributors() {
        try {
            return await this.natsClient.send({ cmd: 'getTopContributors' }, {}).toPromise();
        } catch(error) {
            return error;
        }
    }

    @Get('GetMyOrders')
    @GetMyOrders()
    async getMyOrders(@GetUser() curUser: User) {
        try {
            return await this.natsClient.send({ cmd: 'getMyOrders' }, curUser.id).toPromise();
        } catch(error) {
            return error;
        }
    }
}