import { IntersectionType, PartialType} from '@nestjs/swagger';
import { PaginationDto } from '../globalDtos';
import { User } from '@app/common/models';

/**
 * Data Transfer Object (DTO) for finding all orders of a contribution with optional filters and pagination.
 * 
 * This DTO combines:
 * - Optional fields from `User`.
 * - Pagination fields from `PaginationDto` (`page`, `limit`).
 */
export class GetOrdersOfContributionDto extends IntersectionType(
  User,
  PaginationDto,
) {}