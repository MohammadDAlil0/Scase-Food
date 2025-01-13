import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddFoodDto {
    @ApiProperty({
        description: 'Food ID',
        type: String,
        example: 'xxxx-xxxx'
    })
    @IsString()
    @IsNotEmpty()
    foodId: string;

    @ApiProperty({
        description: 'Order ID',
        type: String,
        example: 'xxxx-xxxx'
    })
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty({
        description: 'Number of pieces',
        type: Number,
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    number: number;
}