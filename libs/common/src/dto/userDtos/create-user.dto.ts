import { Role } from '@app/common/constants';
import { Match } from '@app/common/decorators/confim-password.validator.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a user.
 * 
 * @property username - The username of the user.
 * @property email - The email of the user.
 * @property password - The password of the user.
 * @property confirmPassword - The confirmation of the user's password.
 * @property role - The role of the user (for testing purposes).
 */
export class CreateUserDto {
  /**
   * The username of the user.
   */
  @ApiProperty({
    description: 'Username of a user',
    type: String,
    example: 'user1',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * The email of the user.
   */
  @ApiProperty({
    description: 'Email of a user',
    type: String,
    example: 'user1@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The password of the user.
   */
  @ApiProperty({
    description: 'Password of a user',
    type: String,
    minLength: 8,
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  /**
   * The confirmation of the user's password.
   */
  @ApiProperty({
    description: 'Confirm your password',
    type: String,
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  /**
   * The role of the user (for testing purposes).
   */
  @ApiProperty({
    description: 'Role of a user, it is just for testing',
    enum: Role,
    example: Role.USER,
  })
  @IsEnum(Role)
  role: Role;
}