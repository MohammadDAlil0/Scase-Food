import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
    @ApiProperty({
        description: 'Contributor ID',
        type: String,
        example: 'xxxx-xxxx'
    })
    @IsString()
    @IsNotEmpty()
    contributorId: string;


    @Exclude()
    @IsOptional()
    @IsString()
    createdBy?: string;
}