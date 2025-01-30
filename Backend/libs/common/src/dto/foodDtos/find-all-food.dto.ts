import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { PaginationDto } from '../globalDtos';
import { CreateFoodDto } from '.';

/**
 * Data Transfer Object (DTO) for finding all food with optional filters and pagination.
 * 
 * This DTO combines:
 * - Optional fields from `CreateFoodDto` (`name`, `price`, `restaurantId`).
 * - Pagination fields from `PaginationDto` (`page`, `limit`).
 */
export class FindAllFoodDto extends IntersectionType(
  PartialType(PickType(CreateFoodDto, ['name', 'price', 'restaurantId'])),
  PaginationDto,
) {}