import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateRestaurantDto {
    @ApiProperty({
        description: 'Restaurant Name',
        type: String,
        example: 'Al-Abbass'
    })
    @IsNotEmpty()
    @MaxLength(64)
    name: string;

    @ApiProperty({
        description: 'Restaurant phone number',
        type: String,
        example: "+9639843861"
    })
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty({
        description: 'Restaurant picture path',
        type: String,
        example: 'http://sdaf.sdf.sdf'
    })
    @IsOptional()
    @IsString()
    picturePath?: string

    @ApiProperty({
        description: 'Restaurant adress',
        type: String,
        example: 'Al-Yamma Stree'
    })
    @IsOptional()
    @IsString()
    adress?: string;
}
