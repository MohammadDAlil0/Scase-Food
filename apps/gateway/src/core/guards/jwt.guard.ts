import { AuthGuard } from "@nestjs/passport";

/**
 * Use this Guard to prevent unauthenticated users to get in.
 * You can see the validation details from here: '../strategies/jwt.strategy.ts'
 */
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
}