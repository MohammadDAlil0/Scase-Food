import { applyDecorators, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Role } from "@app/common/constants";
import { JwtGuard, RolesGuard } from "../../core/guards";
import { Roles } from "../../user/decorators/roles.decorator";

export function RestaurantGlobalDecorator() {
    return applyDecorators(
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN, Role.USER)
    )
}

export function CreateRestauranDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Create Restaurant' }),
        ApiResponse({ status: HttpStatus.CREATED, description: 'You will the cerated restaurant' }),
        Roles(Role.ADMIN)
    )
}

export function FindAllRestaurantDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get All Restaurants' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get a list of restaurants' }),
    );
}

export function FindRestaurantDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get Restaurant'}),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get restaurant' }),
    )
}

export function UpdateRestauranDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Update Restaurant' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will the updated restaurant' }),
        Roles(Role.ADMIN)
    )
}

export function DeleteRestauranDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete Restaurant' }),
        ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'You will the deleted restaurant' }),
        Roles(Role.ADMIN),
        HttpCode(HttpStatus.NO_CONTENT)
    )
}