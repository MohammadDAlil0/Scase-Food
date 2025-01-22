import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a food item.
 * 
 * @property name - The name of the food.
 * @property price - The price of the food.
 * @property restaurantId - The ID of the restaurant to which the food belongs.
 */
export class CreateFoodDto {
  /**
   * The name of the food.
   */
  @ApiProperty({
    description: 'Name of the food',
    type: String,
    example: 'Food1',
  })
  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  name: string;

  /**
   * The price of the food.
   */
  @ApiProperty({
    description: 'Price of the food',
    type: Number,
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  /**
   * The ID of the restaurant to which the food belongs.
   */
  @ApiProperty({
    description: 'ID of the restaurant',
    type: String,
    example: 'xxxx-xxxx-xxxx-xxxx',
  })
  @IsUUID()
  @IsDefined()
  restaurantId: string;
}