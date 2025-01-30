import { PartialType } from '@nestjs/swagger';
import { CreateFoodDto } from './create-food.dto';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for updating a food item.
 * 
 * This DTO extends the `CreateFoodDto` with all fields optional.
 * Additionally, it includes an optional `id` field, which is excluded from responses.
 */
export class UpdateFoodDto extends PartialType(CreateFoodDto) {
  /**
   * The ID of the food item. This field is excluded from responses.
   */
  @Exclude()
  @IsOptional()
  @IsString()
  id?: string;
}