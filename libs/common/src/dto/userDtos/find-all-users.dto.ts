import { ApiProperty, ApiQuery, IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { PaginationDto } from "../globalDtos";

/**
 * @param username string?
 * @param email string?
 * @param role Role - The role of the user, which can be ADMIN, USER, or GHOST
 * @param page number
 * @param limit number
 */
export class FindAllUsersDto extends  IntersectionType(PartialType(PickType(CreateUserDto, ['username', 'email', 'role'])), PaginationDto) {}