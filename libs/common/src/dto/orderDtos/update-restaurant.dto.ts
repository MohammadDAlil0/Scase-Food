import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
    @Exclude()
    @IsOptional()
    @IsString()
    id?: string;
}
