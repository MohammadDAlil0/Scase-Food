import { Role } from "@app/common/constants";
import { applyDecorators, HttpStatus, HttpCode, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../../core/decorators";
import { JwtGuard, RolesGuard, NotMeApi, UserOrderGuard } from "../../core/guards";

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
 * Applies decorators for the Forgot Password endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Forgot Password".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will receive a message. Check your mailbox.".
 * - `HttpCode(HttpStatus.OK)` to set the HTTP status code to 200.
 */
export function ForgotPasswordDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Forgot Your Password' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will receive a message. Check your mailbox.' }),
    HttpCode(HttpStatus.OK),
  );
}

/**
 * Applies decorators for the Reset Password endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Reset Password".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get the updated user".
 * - `HttpCode(HttpStatus.OK)` to set the HTTP status code to 200.
 */
export function ResetPasswordDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Reset Your Password' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the updated user' }),
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
 * Applies decorators for the "Get The Current User" endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Get The Current User".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get the current user".
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard)` to enforce JWT.
 */
export function GetMeDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Get The Current User' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the current user' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard),
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
    UseGuards(JwtGuard, RolesGuard, UserOrderGuard),
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
 * Decorator for the "Delete User" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Delete User".
 * - `ApiResponse` with a status of `HttpStatus.NO_CONTENT`.
 * - `Roles(Role.ADMIN)` to restrict access to users with the `ADMIN` role.
 * - `HttpCode(HttpStatus.NO_CONTENT)` to set the HTTP status code to 204.
 */
export function DeleteUserDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete User' }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'You will not get anything' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN),
    HttpCode(HttpStatus.NO_CONTENT),
  );
}