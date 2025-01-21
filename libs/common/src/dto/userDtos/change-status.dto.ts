import { User } from "@app/common/models";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * @property userId string
 * @param dateToCall? Date
 * @param resaurantId? string
 */
export class ChangeStatusDto {
    @IsString()
    @IsNotEmpty()
    @Exclude()
    userId: string;

    @ApiProperty({
        description: 'Expected Date to call',
        type: Date
    })
    @IsOptional()
    @Type(() => Date)
    dateToCall?: Date;

    @ApiProperty({
        description: 'Restaurant ID',
        type: String,
        example: 'xxxx-xxxx'
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    restaurantId?: string;
}