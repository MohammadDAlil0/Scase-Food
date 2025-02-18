import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
/**
 * Data Transfer Object (DTO) for Fogot Password.
 * 
 * This DTO picks the `email` fields from the `CreateUserDto`.
 */
export class ForgotPasswordDto extends PickType(CreateUserDto, ['email']) {}