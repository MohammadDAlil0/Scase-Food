import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { Exclude } from "class-transformer";

export class ResetPasswordDto extends PickType(CreateUserDto, ['password', 'confirmPassword']) {
      /**
       * The Reset Token to update the password.
       */
      @Exclude()
      resetToken: string;
}