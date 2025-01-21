import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class PaginationDto {
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