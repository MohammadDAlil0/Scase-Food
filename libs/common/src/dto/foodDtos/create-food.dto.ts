import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateFoodDto {
    @ApiProperty({
        description: 'Name of the food',
        type: String,
        example: 'Food1'
    })
    @IsString()
    @MaxLength(64)
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Price of the food',
        type: Number,
        example: 10
    })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    price: number;

    @ApiProperty({
        description: 'ID of the restaurant',
        type: String,
        example: 'xxxx-xxxx-xxxx-xxxx'
    })
    @IsUUID()
    @IsDefined()
    restaurantId: string;
}
