import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { Exclude } from "class-transformer";

/**
 * Data Transfer Object (DTO) for Reset Password.
 * 
 * This DTO picks the `email` and `confirmPassword` fields from the `CreateUserDto`. Also, It has `resetToken` as Excluded field.
 */
export class ResetPasswordDto extends PickType(CreateUserDto, ['password', 'confirmPassword']) {
      /**
       * The Reset Token to update the password.
       */
      @Exclude()
      resetToken: string;
}