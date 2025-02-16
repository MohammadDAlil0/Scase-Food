import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto, ChangeRoleDto, ChangeStatusDto, ResetPasswordDto, FindAllUsersDto, ForgotPasswordDto } from '@app/common/dto/userDtos';
import { PaginationDto } from '@app/common/dto/globalDtos';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('user')
export class UserController {
    constructor(
        @Inject() private readonly userService: UserService,
    ) { }

    @MessagePattern({ cmd: 'signup' })
    async signup(@Payload() createUserDto: CreateUserDto) {
        return await this.userService.signup(createUserDto);
    }

    @MessagePattern({ cmd: 'login' })
    async login(@Payload() loginDto: LoginDto) {
        return this.userService.login(loginDto);
    }

    @MessagePattern({ cmd: 'forgotPassword' })
    forgotPassword(@Payload() forgotPasswordDto: ForgotPasswordDto) {
        return this.userService.forgotPassword(forgotPasswordDto);
    }

    @MessagePattern({ cmd: 'resetPassword' })
    resetPassword(@Payload() resetPasswordDto: ResetPasswordDto) {
        return this.userService.resetPassword(resetPasswordDto);
    }

    @MessagePattern({ cmd: 'getAllUsers' })
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

    @MessagePattern({ cmd: 'getAllActiveContributors' })
    getAllActiveContributors(@Payload() filter: PaginationDto) {
        return this.userService.getAllActiveContributors(filter);
    }

    @MessagePattern({ cmd: 'getTopContributors' })
    getTopContributors(@Payload() filter: PaginationDto) {
        return this.userService.getTopContributors(filter);
    }

    @MessagePattern({ cmd: 'deleteUser' })
    deleteUser(@Payload() userId: string) {
        return this.userService.deleteUser(userId);
    }

    /**
     * Automatically, uncontribute all the users who forgot to click the uncontribute button from 3 hours.
     */
    @Cron(CronExpression.EVERY_2_HOURS)
    async uncontributeForgettens() {
        this.userService.uncontributeForgettens();
    }
}
