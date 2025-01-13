import { User } from "@app/common/models";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class ChangeStatusDto {
    @ApiProperty({
        description: 'Expected Date to call',
        type: Date
    })
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Date)
    dateToCall?: Date;

    @Exclude()
    @IsOptional()
    curUser: User;
}