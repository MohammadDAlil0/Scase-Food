import { applyDecorators, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from '@app/common/constants';
import { JwtGuard, RolesGuard, NotMeApi, StillOnGoingGuard, UserOrderGuard, ContributorApi } from '../../core/guards';
import { Roles } from './roles.decorator';

/**
 * Swagger Decorators.
 * @returns A set of decorators
 */
export function SignupDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Signup A User' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'You will get a user with an access-token' }),
  );
}

/**
 * Swagger, and HttpCode Decorators.
 * @returns A set of decorators
 */
export function LoginDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Login A User' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get a user with an access-token' }),
        HttpCode(HttpStatus.OK)
    );
}

export function GetAllUsersDecorator() {
  return applyDecorators(
    ApiOperation({ summary: "Get All Users" }),
    ApiResponse({ status: 200, description: 'You will get the all Users' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN),
  )
}

export function ChangeRoleDecorator() {
    return applyDecorators(
      ApiOperation({ summary: "Change A User's Role" }),
      ApiResponse({ status: 200, description: 'You will get the updated user' }),
      ApiBearerAuth(),
      UseGuards(JwtGuard, RolesGuard, NotMeApi),
      Roles(Role.ADMIN),
    );
}

export function ChangeStatusDecorator() {
  return applyDecorators(
    ApiOperation({ summary: "Change Status To Order" }),
    ApiResponse({ status: 200, description: 'You will get a message' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  )
}

export function CraeteOrderDecorator() {
  return applyDecorators(
    ApiOperation({ summary: "Create Order" }),
    ApiResponse({ status: 201, description: 'You will get the created order' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard, StillOnGoingGuard),
    Roles(Role.ADMIN, Role.USER),
  )
}

export function SubmitOrderDecorator() {
  return applyDecorators(
      ApiOperation({ summary: 'Submit Order' }),
      ApiResponse({ status: HttpStatus.OK, description: 'You will get a message' }),
      ApiBearerAuth(),
      UseGuards(JwtGuard, RolesGuard, StillOnGoingGuard, UserOrderGuard),
      Roles(Role.ADMIN, Role.USER),
  )
}

export function GetAllActiveContributors() {
  return applyDecorators(
    ApiOperation({ summary: 'Get All Contributors' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get all contributors' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  )
}
export function ChangeStatusOfOrder() {
  return applyDecorators(
    ApiOperation({ summary: 'Change Status Of Order' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the updated order' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard, ContributorApi),
    Roles(Role.ADMIN, Role.USER),
  )
}

export function GetTopContributors() {
  return applyDecorators(
    ApiOperation({ summary: 'Get Top Contributors' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the top contributors' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  )
}

export function GetMyOrders() {
  return applyDecorators(
    ApiOperation({ summary: 'Get My Orders' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get your orders' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  )
}