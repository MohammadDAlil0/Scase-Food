import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@app/common/constants';

/**
 * Data Transfer Object (DTO) for changing a user's role.
 * 
 * @property userId - The ID of the user whose role will be changed.
 * @property role - The new role of the user, which can be ADMIN, USER, or GHOST.
 */
export class ChangeRoleDto {
  /**
   * The ID of the user whose role will be changed.
   */
  @ApiProperty({
    description: 'User ID',
    type: String,
    example: 'xxxx-xxxx',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  /**
   * The new role of the user.
   */
  @ApiProperty({
    description: 'Role of a user',
    enum: Role, // Use the Role enum directly
    example: 'USER',
  })
  @IsEnum(Role)
  role: Role;
}