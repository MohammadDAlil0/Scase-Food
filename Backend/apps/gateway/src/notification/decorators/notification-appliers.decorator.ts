import { applyDecorators, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard, RolesGuard } from '../../core/guards';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '@app/common/constants';

/**
 * Applies decorators for the "Get All Notifications" endpoint.
 * 
 * This decorator combines the following:
 * - `ApiOperation` to describe the endpoint with a summary.
 * - `ApiResponse` to define the success response with a status of `HttpStatus.OK` and a description.
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard)` to enforce JWT and role-based access control.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 *
 * @returns {MethodDecorator} A set of decorators for the "Get All Notifications" endpoint.
 */
export function FindAllNotificationDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get All Notifications' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get a list of notifications' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  );
}

/**
 * Applies decorators for the "Get Unseen Notifications" endpoint.
 * 
 * This decorator combines the following:
 * - `ApiOperation` to describe the endpoint with a summary.
 * - `ApiResponse` to define the success response with a status of `HttpStatus.OK` and a description.
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard)` to enforce JWT and role-based access control.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 *
 * @returns {MethodDecorator} A set of decorators for the "Get Unseen Notifications" endpoint.
 */
export function GetUnSeenNotificationsDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get The Number Of Unseen notifications' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the number of unseen notifications' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  );
}