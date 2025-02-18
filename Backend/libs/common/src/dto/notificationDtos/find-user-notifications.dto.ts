import { IntersectionType, PartialType } from "@nestjs/swagger";
import { PaginationDto } from "../globalDtos";
import { Exclude } from "class-transformer";
import { IsOptional } from "class-validator";

/**
 * Data Transfer Object (DTO) for finding notifications of a user.
 * 
 * This DTO combines:
 * - Excluded fields userId.
 * - Pagination fields from `PaginationDto` (`page`, `limit`).
 */
export class FindUsersNotificationsDto extends PartialType(PaginationDto) {
  /**
   * The ID of the user.
   */
  @Exclude()
  @IsOptional()
  userId: string;
}