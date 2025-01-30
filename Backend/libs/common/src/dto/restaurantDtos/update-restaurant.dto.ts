import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for updating a restaurant.
 * 
 * This DTO extends the `CreateRestaurantDto` with all fields optional.
 * Additionally, it includes an optional `id` field, which is excluded from responses.
 */
export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  /**
   * The ID of the restaurant. This field is excluded from responses.
   */
  @Exclude()
  @IsOptional()
  @IsString()
  id?: string;
}