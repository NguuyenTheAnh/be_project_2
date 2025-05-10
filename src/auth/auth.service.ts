import { comparePassword, hashPassword } from '@/helper/bcrypt.helper';
import { AccountService } from '@/modules/account/account.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private accountService: AccountService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    createRefreshToken(payload: any) {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as StringValue) / 1000
        })
        return refresh_token;
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.accountService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const IsPasswordValid = await comparePassword(password, user.password);
        if (IsPasswordValid) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any, response: Response) {
        const { account_id, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            account_id,
            email,
            role
        };

        const refresh_token = this.createRefreshToken(payload)
        // update user token with refresh token
        await this.accountService.updateUserToken(refresh_token, account_id);

        // set cookie
        response.cookie('refresh_token', refresh_token, {
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as StringValue),
            httpOnly: true
        })


        console.log('Response headers after setting cookie:', response.getHeaders());

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                account_id,
                email,
                role
            }
        };
    }
    async register(registerDto: any) {
        // Implement your registration logic here
        // For example, you might want to hash the password and save the user to the database
        const { email, password } = registerDto;
        const existingUser = await this.accountService.findByEmail(email);
        if (existingUser) {
            throw new UnauthorizedException('Email already exists');
        }
        // Hash the password and save the user
        const hashedPassword = await hashPassword(password);
        let account = await this.accountService.create({ ...registerDto, password: hashedPassword });
        return {
            account_id: account.account_id,
            created_at: account.created_at,
        };
    }

    async processNewToken(refreshToken: string, response: Response) {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            });

            let user = await this.accountService.findUserByToken(refreshToken);
            if (user) {
                const { account_id, email, role } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    account_id,
                    email,
                    role
                };

                const refresh_token = this.createRefreshToken(payload)
                // update user token with refresh token
                await this.accountService.updateUserToken(refresh_token, account_id);

                // set cookie
                response.clearCookie('refresh_token');
                response.cookie('refresh_token', refresh_token, {
                    maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as StringValue),
                    httpOnly: true
                })

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        account_id,
                        email,
                        role
                    }
                };
            }
            else {
                throw new BadRequestException('Not found user')
            }
        } catch (error) {
            throw new BadRequestException('Refresh token invalid. Please login')
        }
    }

    async logout(user: any, response: Response) {
        await this.accountService.removeUserToken(user.account_id);
        response.clearCookie('refresh_token');
        return 'ok';
    }

}