import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for adding food to an order.
 * 
 * @property foodId - The ID of the food to add.
 * @property orderId - The ID of the order to which the food will be added.
 * @property number - The number of pieces of the food to add.
 */
export class AddFoodDto {
  /**
   * The ID of the food to add.
   */
  @ApiProperty({
    description: 'Food ID',
    type: String,
    example: 'xxxx-xxxx',
  })
  @IsString()
  @IsNotEmpty()
  foodId: string;

  /**
   * The ID of the order to which the food will be added.
   */
  @ApiProperty({
    description: 'Order ID',
    type: String,
    example: 'xxxx-xxxx',
  })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  /**
   * The number of pieces of the food to add.
   */
  @ApiProperty({
    description: 'Number of pieces',
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  number: number;
}