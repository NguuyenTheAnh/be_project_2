
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService
    ) {
        // decode token
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET') as string,
        });
    }

    // validate return data stored in req.user
    async validate(payload: any) {
        const { account_id, email, role } = payload;

        return {
            account_id,
            email,
            role,
        };
    }

}
