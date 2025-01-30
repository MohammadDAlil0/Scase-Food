import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a restaurant.
 * 
 * @property name - The name of the restaurant.
 * @property phoneNumber - The phone number of the restaurant (optional).
 * @property picturePath - The URL or path to the restaurant's picture (optional).
 * @property address - The address of the restaurant (optional).
 */
export class CreateRestaurantDto {
  /**
   * The name of the restaurant.
   */
  @ApiProperty({
    description: 'Restaurant name',
    type: String,
    example: 'Al-Abbass',
  })
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  /**
   * The phone number of the restaurant.
   */
  @ApiProperty({
    description: 'Restaurant phone number',
    type: String,
    example: '+9639843861',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  /**
   * The URL or path to the restaurant's picture.
   */
  @ApiProperty({
    description: 'Restaurant picture path',
    type: String,
    example: 'http://example.com/picture.jpg',
  })
  @IsOptional()
  @IsString()
  picturePath?: string;

  /**
   * The address of the restaurant.
   */
  @ApiProperty({
    description: 'Restaurant address',
    type: String,
    example: 'Al-Yamma Street',
  })
  @IsOptional()
  @IsString()
  address?: string;
}