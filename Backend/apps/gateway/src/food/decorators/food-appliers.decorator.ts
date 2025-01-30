import { applyDecorators, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FoodRestauranGuard, JwtGuard, RolesGuard } from '../../core/guards';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '@app/common/constants';

/**
 * Base decorator for food-related endpoints.
 * Applies common decorators for authentication, role-based access control, and JWT validation.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiBearerAuth` for JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard)` for JWT and role-based access control.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 */
export function FoodGlobalDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  );
}

/**
 * Decorator for the "Create Food" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Create Food".
 * - `ApiResponse` with a status of `HttpStatus.CREATED` and a description of "You will get the created food".
 * - `Roles(Role.ADMIN)` to restrict access to users with the `ADMIN` role.
 */
export function CreateFoodDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create Food' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'You will get the created food' }),
    Roles(Role.ADMIN),
  );
}

/**
 * Decorator for the "Get All Foods" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Get All Foods".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get a list of foods".
 */
export function FindAllFoodDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get All Foods' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get a list of foods' }),
  );
}

/**
 * Decorator for the "Get Food" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Get Food".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get the food".
 */
export function FindFoodDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get Food' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the food' }),
  );
}

/**
 * Decorator for the "Update Food" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Update Food".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get the updated food".
 * - `Roles(Role.ADMIN)` to restrict access to users with the `ADMIN` role.
 */
export function UpdateFoodDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Update Food' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the updated food' }),
    Roles(Role.ADMIN),
  );
}

/**
 * Decorator for the "Delete Food" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Delete Food".
 * - `ApiResponse` with a status of `HttpStatus.NO_CONTENT` and a description of "You will get the deleted food".
 * - `Roles(Role.ADMIN)` to restrict access to users with the `ADMIN` role.
 * - `HttpCode(HttpStatus.NO_CONTENT)` to set the HTTP status code to 204.
 */
export function DeleteFoodDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete Food' }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'You will get the deleted food' }),
    Roles(Role.ADMIN),
    HttpCode(HttpStatus.NO_CONTENT),
  );
}