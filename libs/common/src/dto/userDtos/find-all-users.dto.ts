import { ApiProperty, IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { PaginationDto } from '../globalDtos';

/**
 * Data Transfer Object (DTO) for finding all users with optional filters and pagination.
 * 
 * This DTO combines:
 * - Optional fields from `CreateUserDto` (`username`, `email`, `role`).
 * - Pagination fields from `PaginationDto` (`page`, `limit`).
 */
export class FindAllUsersDto extends IntersectionType(
  PartialType(PickType(CreateUserDto, ['username', 'email', 'role'])),
  PaginationDto,
) {}