import { ApiProperty, ApiQuery, PartialType, PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

/**
 * @param username string?
 * @param email string?
 * @param role [ADMIN, USER, GHOST]? For Testing
 * @param page number
 * @param limit number
 */
export class FindAllUsersDto extends PartialType(PickType(CreateUserDto, ['username', 'email', 'role'])) {
    @ApiProperty({
            description: 'Page number',
            type: Number,
            example: 1
    })
    @IsNumber()
    @Type(() => Number)
    page: number;

    @ApiProperty({
        description: 'Number of items per page',
        type: Number,
        example: 10
    })
    @IsNumber()
    @Type(() => Number)
    limit: number;
    
}