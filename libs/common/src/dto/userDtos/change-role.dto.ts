import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@app/common/constants";

export class ChangeRoleDto {
    @ApiProperty({
        description: 'User ID',
        type: String,
        example: 'xxxx-xxxx'
    })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsEnum(Role)
    @ApiProperty({
        description: 'Role of a user',
        enum: ['GHOST', 'USER', 'ADMIN']
    })
    role: Role;
}
