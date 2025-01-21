import { applyDecorators, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from '@app/common/constants';
import { JwtGuard, RolesGuard, NotMeApi, StillOnGoingGuard, UserOrderGuard, ContributorApi } from '../../core/guards';
import { Roles } from './roles.decorator';

/**
 * Applies decorators for the user signup endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Signup A User".
 * - `ApiResponse` with a status of `HttpStatus.CREATED` and a description of "You will get a user with an access-token".
 */
export function SignupDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Signup A User' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'You will get a user with an access-token' }),
  );
}

/**
 * Applies decorators for the user login endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Login A User".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get a user with an access-token".
 * - `HttpCode(HttpStatus.OK)` to set the HTTP status code to 200.
 */
export function LoginDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Login A User' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get a user with an access-token' }),
    HttpCode(HttpStatus.OK),
  );
}

/**
 * Applies decorators for the "Get All Users" endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Get All Users".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get a set of users".
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard)` to enforce JWT and role-based access control.
 * - `Roles(Role.ADMIN)` to restrict access to users with the `ADMIN` role.
 */
export function GetAllUsersDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get All Users' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get a set of users' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN),
  );
}

/**
 * Applies decorators for the "Change User Role" endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Change A User's Role".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get the updated user".
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard, NotMeApi)` to enforce JWT, role-based access control, and prevent self-role changes.
 * - `Roles(Role.ADMIN)` to restrict access to users with the `ADMIN` role.
 */
export function ChangeRoleDecorator() {
  return applyDecorators(
    ApiOperation({ summary: "Change A User's Role" }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the updated user' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard, NotMeApi),
    Roles(Role.ADMIN),
  );
}

/**
 * Applies decorators for the "Change User Status" endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Change Status Of User".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get the updated user".
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard)` to enforce JWT and role-based access control.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 */
export function ChangeStatusDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Change Status Of User' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the updated user' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  );
}

/**
 * Applies decorators for the "Create Order" endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Create Order".
 * - `ApiResponse` with a status of `HttpStatus.CREATED` and a description of "You will get the created order".
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard, StillOnGoingGuard)` to enforce JWT, role-based access control, and ongoing status validation.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 */
export function CraeteOrderDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create Order' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'You will get the created order' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard, StillOnGoingGuard),
    Roles(Role.ADMIN, Role.USER),
  );
}

/**
 * Applies decorators for the "Submit Order" endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Submit Order".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get a message".
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard, StillOnGoingGuard, UserOrderGuard)` to enforce JWT, role-based access control, ongoing status validation, and user order validation.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 */
export function SubmitOrderDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Submit Order' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get a message' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard, StillOnGoingGuard, UserOrderGuard),
    Roles(Role.ADMIN, Role.USER),
  );
}

/**
 * Applies decorators for the "Get All Active Contributors" endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Get All Contributors".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get all contributors".
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard)` to enforce JWT and role-based access control.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 */
export function GetAllActiveContributors() {
  return applyDecorators(
    ApiOperation({ summary: 'Get All Contributors' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get all contributors' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  );
}

/**
 * Applies decorators for the "Change Status Of Order" endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Change Status Of Order".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get the updated order".
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard, ContributorApi)` to enforce JWT, role-based access control, and contributor validation.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 */
export function ChangeStatusOfOrder() {
  return applyDecorators(
    ApiOperation({ summary: 'Change Status Of Order' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the updated order' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard, ContributorApi),
    Roles(Role.ADMIN, Role.USER),
  );
}

/**
 * Applies decorators for the "Get Top Contributors" endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Get Top Contributors".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get the top contributors".
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard)` to enforce JWT and role-based access control.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 */
export function GetTopContributors() {
  return applyDecorators(
    ApiOperation({ summary: 'Get Top Contributors' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the top contributors' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  );
}

/**
 * Applies decorators for the "Get My Orders" endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Get My Orders".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get your orders".
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard)` to enforce JWT and role-based access control.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 */
export function GetMyOrders() {
  return applyDecorators(
    ApiOperation({ summary: 'Get My Orders' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get your orders' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  );
}