import { Food } from '@app/common/models';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating an order.
 * 
 * @property contributorId - The ID of the contributor associated with the order.
 * @property createdBy - The ID of the user who created the order.
 * @property numberOfContributions - The number of contributions associated with the order.
 * @property foods - Array of objects contains the food-ID, and number of items of each selected food.
 */
export class CreateOrderDto {
  /**
   * The ID of the contributor associated with the order.
   */
  @ApiProperty({
    description: 'Contributor ID',
    type: String,
    example: 'xxxx-xxxx',
  })
  @IsString()
  @IsNotEmpty()
  contributorId: string;

  /**
   * The ID of the user who created the order.
   */
  @Exclude()
  @IsOptional()
  @IsString()
  createdBy?: string;

  /**
   * The number of contributions associated with the order.
   */
  @Exclude()
  @IsOptional()
  @IsString()
  numberOfContributions: string;

  /**
   * The selected food of the order.
  */
  @ApiProperty({
    description: 'Foods',
    type: Array,
    example: [{
      foodId: 'xxxx-xxxx',
      number: 1
    }],
  })
  @IsArray()
  @IsNotEmpty()
  foods: [{
    foodId: string,
    number: number
  }];

  /**
   * The ID of the restaurant.
   */
  @Exclude()
  @IsOptional()
  @IsString()
  restaurantId?: string;
}