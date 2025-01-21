import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

/**
 * @param email string
 * @param password string
 */
export class LoginDto extends PickType(CreateUserDto, ['email', 'password'] as const) {}
