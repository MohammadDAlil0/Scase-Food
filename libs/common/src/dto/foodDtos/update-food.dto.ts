import { PartialType } from '@nestjs/swagger';
import { CreateFoodDto } from './create-food.dto';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
    @Exclude()
    @IsOptional()
    @IsString()
    id?: string;
}
