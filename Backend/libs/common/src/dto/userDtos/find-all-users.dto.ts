import { ApiProperty, IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { PaginationDto } from '../globalDtos';
import { Role } from '@app/common/constants';
import { IsOptional, IsEnum } from 'class-validator';

/**
 * Data Transfer Object (DTO) for finding all users with optional filters and pagination.
 * 
 * This DTO combines:
 * - Optional fields from `CreateUserDto` (`username`, `email`, `role`).
 * - Pagination fields from `PaginationDto` (`page`, `limit`).
 */
export class FindAllUsersDto extends IntersectionType(
  PartialType(PickType(CreateUserDto, ['username', 'email'])),
  PaginationDto,
) {
  /**
   * The role of the user (for testing purposes).
   */
  @ApiProperty({
    description: 'Role of a user, it is just for testing',
    enum: Role,
    example: Role.USER,
  })
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}