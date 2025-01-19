import { applyDecorators, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtGuard, RolesGuard, UserOrderGuard } from "../../core/guards";
import { Roles } from "../../user/decorators/roles.decorator";
import { Role } from "@app/common/constants";

/**
 * A Global decorators for all food's routes including Authentication, and Authorization(Admins And Users).
 * @returns A set of decorators
 */
export function FoodGlobalDecorator() {
    return applyDecorators(
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),        
        Roles(Role.ADMIN, Role.USER)
    )
}

/**
 * 
 * @returns 
 */
export function CreateFoodDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Create Food' }),
        ApiResponse({ status: HttpStatus.CREATED, description: 'You will the cerated food' }),
        Roles(Role.ADMIN)
    )
}

export function FindAllFoodDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get All Foods' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get a list of foods' }),
    );
}

export function FindFoodDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get Food'}),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get food' }),
    )
}

export function UpdateFoodDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Update Food' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will the updated food' }),
        Roles(Role.ADMIN)
    )
}

export function DeleteFoodDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete Food' }),
        ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'You will the deleted food' }),
        Roles(Role.ADMIN),
        HttpCode(HttpStatus.NO_CONTENT)
    )
}

export function AddFoodDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Add Food To Order' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get a message' }),
        UseGuards(JwtGuard, RolesGuard, UserOrderGuard),
        Roles(Role.ADMIN, Role.USER)
    )
}

export function DeleteFoodFromOrderDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete Food From Order' }),
        ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'You will the deleted food from order' }),
        UseGuards(JwtGuard, RolesGuard, UserOrderGuard),
        Roles(Role.ADMIN, Role.USER),
        HttpCode(HttpStatus.NO_CONTENT)
    )
}
