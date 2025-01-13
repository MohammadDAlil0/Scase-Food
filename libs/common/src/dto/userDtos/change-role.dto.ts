import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@app/common/constants";
import { Exclude } from "class-transformer";

export class ChangeRoleDto {
    @IsEnum(Role)
    @ApiProperty({
        description: 'Role of a user',
        enum: ['GHOST', 'USER', 'ADMIN']
    })
    role: Role;

    @Exclude()
    @IsOptional()
    @IsString()
    userId: string;
}
