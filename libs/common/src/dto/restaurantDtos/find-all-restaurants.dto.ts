import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { PaginationDto } from '../globalDtos';
import { CreateRestaurantDto } from './create-restaurant.dto';

/**
 * Data Transfer Object (DTO) for finding all restaurants with optional filters and pagination.
 * 
 * This DTO combines:
 * - Optional fields from `CreateRestaurantDto` (`name`, `address`, `phoneNumber`).
 * - Pagination fields from `PaginationDto` (`page`, `limit`).
 */
export class FindAllRestaurantsDto extends IntersectionType(
  PartialType(PickType(CreateRestaurantDto, ['name', 'address', 'phoneNumber'])),
  PaginationDto,
) {}