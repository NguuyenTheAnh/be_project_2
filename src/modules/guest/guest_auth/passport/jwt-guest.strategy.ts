
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuestStrategy extends PassportStrategy(Strategy, 'jwt-guest') {
    constructor(
        private configService: ConfigService
    ) {
        // decode token
        super({
            jwtFromRequest: ExtractJwt.fromHeader('access_token_guest'),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET') as string,
        });
    }

    // validate return data stored in req.user
    async validate(payload: any) {
        const { guest_id, guest_name, cart_id, table_id, table_name } = payload;

        return {
            guest_id,
            guest_name,
            cart_id,
            table_id,
            table_name
        };
    }

}
