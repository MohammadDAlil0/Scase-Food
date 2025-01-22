import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for changing the status of an entity.
 * 
 * @property userId - The ID of the user. This field is excluded from responses.
 * @property dateToCall - The expected date to call (optional).
 * @property restaurantId - The ID of the restaurant (optional).
 */
export class ChangeStatusDto {
  /**
   * The ID of the user. This field is excluded from responses.
   */
  @Exclude()
  userId: string;

  /**
   * The expected date to call.
   */
  @ApiProperty({
    description: 'Expected date to call',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  dateToCall?: Date;

  /**
   * The ID of the restaurant.
   */
  @ApiProperty({
    description: 'Restaurant ID',
    type: String,
    example: 'xxxx-xxxx',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  restaurantId?: string;
}