import { PartialType } from "@nestjs/swagger";
import { PaginationDto } from "../globalDtos";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindMyOrdersDto extends PartialType(PaginationDto) {
    /**
    * The ID of the user whose role will be changed.
    */
    @Exclude()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    userId?: string;
}