import { applyDecorators, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from '@app/common/constants';
import { JwtGuard, RolesGuard } from '../../core/guards';
import { Roles } from '../../core/decorators/roles.decorator';

/**
 * Base decorator for restaurant-related endpoints.
 * Applies common decorators for authentication, role-based access control, and JWT validation.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiBearerAuth` for JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard)` for JWT and role-based access control.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 */
export function RestaurantGlobalDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  );
}

/**
 * Decorator for the "Create Restaurant" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Create Restaurant".
 * - `ApiResponse` with a status of `HttpStatus.CREATED` and a description of "You will get the created restaurant".
 * - `Roles(Role.ADMIN)` to restrict access to users with the `ADMIN` role.
 */
export function CreateRestaurantDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create Restaurant' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'You will get the created restaurant' }),
    Roles(Role.ADMIN),
  );
}

/**
 * Decorator for the "Get All Restaurants" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Get All Restaurants".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get a list of restaurants".
 */
export function FindAllRestaurantDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get All Restaurants' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get a list of restaurants' }),
  );
}

/**
 * Decorator for the "Get Restaurant" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Get Restaurant".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get the restaurant".
 */
export function FindRestaurantDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get Restaurant' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the restaurant' }),
  );
}

/**
 * Decorator for the "Update Restaurant" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Update Restaurant".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get the updated restaurant".
 * - `Roles(Role.ADMIN)` to restrict access to users with the `ADMIN` role.
 */
export function UpdateRestaurantDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update Restaurant' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the updated restaurant' }),
    Roles(Role.ADMIN),
  );
}

/**
 * Decorator for the "Delete Restaurant" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Delete Restaurant".
 * - `ApiResponse` with a status of `HttpStatus.NO_CONTENT` and a description of "You will get the deleted restaurant".
 * - `Roles(Role.ADMIN)` to restrict access to users with the `ADMIN` role.
 * - `HttpCode(HttpStatus.NO_CONTENT)` to set the HTTP status code to 204.
 */
export function DeleteRestaurantDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete Restaurant' }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'You will get the deleted restaurant' }),
    Roles(Role.ADMIN),
    HttpCode(HttpStatus.NO_CONTENT),
  );
}