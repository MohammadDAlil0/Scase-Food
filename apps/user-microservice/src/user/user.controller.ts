import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto, ChangeRoleDto, ChangeStatusDto, CreateOrderDto } from '@app/common/dto/userDtos';
import { FindAllUsersDto } from '@app/common/dto/userDtos/find-all-users.dto';
import { PaginationDto } from '@app/common/dto/globalDtos';
import { User } from '@app/common/models';
import { GetOrdersOfContributionDto } from '@app/common/dto/userDtos/get-orders-of-contribution.dto';

@Controller('user')
export class UserController {
    constructor(
        @Inject() private readonly userService: UserService, 
    ) {}

    @MessagePattern({ cmd: 'signup' })
    async signup(@Payload() createUserDto: CreateUserDto) {
        return await this.userService.signup(createUserDto);
    }

    @MessagePattern({ cmd: 'login' })
    async login(@Payload() loginDto: LoginDto) {
        return this.userService.login(loginDto); 
    }

    @MessagePattern({ cmd: 'GetAllUsers' })
    async getAllUsers(@Payload() filter: FindAllUsersDto) {
        return this.userService.getAllUsers(filter);
    }

    @MessagePattern({ cmd: 'changeRole' })
    async changeRole(@Payload() changeRoleDto: ChangeRoleDto) {
        return this.userService.changeRole(changeRoleDto);
    }

    @MessagePattern({ cmd: 'changeStatus' })
    async changeStatus(@Payload() changeStatusDto: ChangeStatusDto) {
        return this.userService.changeStatus(changeStatusDto);

    }

    @MessagePattern({ cmd: 'createOrder' })
    async createOrder(@Payload() createOrderDto: CreateOrderDto) {
        return this.userService.createOrder(createOrderDto);
    }

    @MessagePattern({ cmd: 'submitOrder' })
    submitOrder(@Payload() orderId: string) {
        return this.userService.submitOrder(orderId);
    }

    @MessagePattern({ cmd: 'getAllActiveContributors' })
    getAllActiveContributors(@Payload() filter: PaginationDto) {
        return this.userService.getAllActiveContributors(filter);
    }

    @MessagePattern({ cmd: 'changeStatusOfOrder' })
    changeStatusOfOrder(@Payload() orderId: string) {
        return this.userService.changeStatusOfOrder(orderId);
    }

    @MessagePattern({ cmd: 'getTopContributors' })
    getTopContributors(@Payload() filter: PaginationDto) {
        return this.userService.getTopContributors(filter);
    }

    @MessagePattern({ cmd: 'getMyOrders' })
    getMyOrders(@Payload() userId: string) {
        return this.userService.getMyOrders(userId);
    }

    @MessagePattern({ cmd: 'getOrdersOfContribution' })
    getOrdersOfContribution(@Payload() getOrdersOfContributionDto: GetOrdersOfContributionDto) {
        return this.userService.getOrdersOfContribution(getOrdersOfContributionDto);
    }
}
