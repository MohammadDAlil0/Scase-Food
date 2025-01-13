import { applyDecorators, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtGuard, RolesGuard } from "../../core/guards";
import { Roles } from "../../user/decorators/roles.decorator";
import { Role } from "@app/common/constants";

export function FindAllNotificationDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get All Notifications' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get a list of notifications' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN, Role.USER)
    );
}