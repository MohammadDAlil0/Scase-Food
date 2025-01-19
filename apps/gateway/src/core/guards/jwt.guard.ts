import { AuthGuard } from "@nestjs/passport";

/**
 * Use this Guard to prevent unauthenticated users to get in
 */
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
}