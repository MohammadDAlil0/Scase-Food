import { PaginationDto } from "@app/common/dto/globalDtos";
import { CreateUserDto, LoginDto, FindAllUsersDto, ChangeRoleDto, ChangeStatusDto, ResetPasswordDto, ForgotPasswordDto } from "@app/common/dto/userDtos";
import { User } from "@app/common/models";
import { Controller, Inject, Post, Body, Get, Query, Put, Patch, Param, Delete } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { SignupDecorators, LoginDecorators, GetMeDecorators, GetAllUsersDecorator, ChangeRoleDecorator, ChangeStatusDecorator, GetAllActiveContributors, GetTopContributors, ForgotPasswordDecorators, DeleteUserDecorator, ResetPasswordDecorators } from "./decorators/user-appliers.decorator";
import { GetUser } from "../core/decorators";

@Controller('user')
export class UserController {
    constructor(
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    ) { }

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

    @Patch('forgotPassword')
    @ForgotPasswordDecorators()
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'forgotPassword' }, forgotPasswordDto)
        );
    }

    @Patch('resetPassword/:resetToken')
    @ResetPasswordDecorators()
    async resetPassword(@Param('resetToken') resetToken: string, @Body() resetPasswordDto: ResetPasswordDto) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'resetPassword' }, {
                ...resetPasswordDto,
                resetToken
            })
        );
    }

    @Get('me')
    @GetMeDecorators()
    async getMe(@GetUser() curUser: User) {
        return curUser;
    }

    @Get('getAllUsers')
    @GetAllUsersDecorator()
    async getAllUsers(@Query() filter: FindAllUsersDto) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'getAllUsers' }, filter)
        );
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

    @Get('getAllActiveContributors')
    @GetAllActiveContributors()
    async getAllActiveContributors(@Query() filter: PaginationDto) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'getAllActiveContributors' }, filter)
        );
    }

    @Get('GetTopcontributors')
    @GetTopContributors()
    async getTopContributors(@Query() filter: PaginationDto) {
        return await lastValueFrom(
            this.natsClient.send({ cmd: 'getTopContributors' }, filter)
        );
    }

    @Delete('/:userId')
    @DeleteUserDecorator()
    async deleteUser(@Param('userId') userId: string) {
        await lastValueFrom(
            this.natsClient.emit({ cmd: 'deleteUser' }, userId)
        );
    }

}