import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * Data Transfer Object (DTO) for user login.
 * 
 * This DTO picks the `email` and `password` fields from the `CreateUserDto`.
 */
export class LoginDto extends PickType(CreateUserDto, ['email', 'password'] as const) {}