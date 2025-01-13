import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectModel } from "@nestjs/sequelize";
import { UUID } from "crypto";
import { DataBaseService } from "@app/common/database";
import { User } from "@app/common/models";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService, @InjectModel(User) private readonly UserModel: typeof User,
        @Inject() private readonly dataService: DataBaseService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('JWT_SECRET')
        });
    }

    async validate(payload: {
        sub: UUID,
        email: string
    }) {
        const user: User = await this.dataService.findOneOrThrow(this.UserModel, {
            where: {
                id: payload.sub
            }
        });
        
        delete user.hash;
        return user;
    }

}