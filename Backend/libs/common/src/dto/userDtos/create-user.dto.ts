import { Match } from '@app/common/decorators/confim-password.validator.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a user.
 * 
 * @property username - The username of the user.
 * @property email - The email of the user.
 * @property password - The password of the user.
 * @property confirmPassword - The confirmation of the user's password.
 */
export class CreateUserDto {
  /**
   * The username of the user.
   */
  @ApiProperty({
    description: 'Username of a user',
    type: String,
    example: 'admin1',
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
    example: 'admin1@example.com',
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
    example: '12345678',
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
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}