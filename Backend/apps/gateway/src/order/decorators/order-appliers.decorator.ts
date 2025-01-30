import { Role } from "@app/common/constants";
import { applyDecorators, HttpStatus, UseGuards, HttpCode } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtGuard, RolesGuard, FoodRestauranGuard, StillOnGoingGuard, ContributorApi } from "../../core/guards";
import { Roles } from "../../core/decorators";

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
export function CraeteOrderDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Create Order' }),
        ApiResponse({ status: HttpStatus.CREATED, description: 'You will get the created order' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard, StillOnGoingGuard),
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
export function ChangeStatusOfOrderDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Change Status Of Order' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get the updated order' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard, ContributorApi),
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
export function GetMyOrdersDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Get My Orders' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get your orders' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN, Role.USER),
    );
}

/**
 * Applies decorators for the "Get Orders Of A Contribution" endpoint.
 * 
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Get Orders Of A Contribution".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get the orders of a contribution".
 * - `ApiBearerAuth` to enable JWT authentication.
 * - `UseGuards(JwtGuard, RolesGuard)` to enforce JWT and role-based access control.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 */
export function getOrdersOfContributionDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Get Orders Of A Contribution' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get the orders of a contribution' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN, Role.USER),
    )
}

/**
 * Decorator for the "Add Food To Order" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Add Food To Order".
 * - `ApiResponse` with a status of `HttpStatus.OK` and a description of "You will get a message".
 * - `UseGuards(JwtGuard, RolesGuard, UserOrderGuard)` for JWT, role-based access control, and order validation.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 */
export function AddFoodDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Add Food To Order' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get a message' }),
        UseGuards(JwtGuard, RolesGuard, FoodRestauranGuard),
        Roles(Role.ADMIN, Role.USER),
    );
}

/**
 * Decorator for the "Delete Food From Order" endpoint.
 *
 * @returns {MethodDecorator} A set of decorators including:
 * - `ApiOperation` with a summary of "Delete Food From Order".
 * - `ApiResponse` with a status of `HttpStatus.NO_CONTENT` and a description of "You will get the deleted food from order".
 * - `UseGuards(JwtGuard, RolesGuard, FoodRestauranGuard)` for JWT, role-based access control, and food-order validation.
 * - `Roles(Role.ADMIN, Role.USER)` to restrict access to users with the `ADMIN` or `USER` role.
 * - `HttpCode(HttpStatus.NO_CONTENT)` to set the HTTP status code to 204.
 */
export function DeleteFoodFromOrderDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete Food From Order' }),
        ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'You will get the deleted food from order' }),
        UseGuards(JwtGuard, RolesGuard, FoodRestauranGuard),
        Roles(Role.ADMIN, Role.USER),
        HttpCode(HttpStatus.NO_CONTENT),
    );
}