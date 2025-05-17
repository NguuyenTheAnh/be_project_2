import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestAuthDto } from './dto/create-guest_auth.dto';
import { UpdateGuestAuthDto } from './dto/update-guest_auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CartService } from '@/modules/cart/cart.service';
import { TableService } from '@/modules/table/table.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from '../entities/guest.entity';
import { Repository } from 'typeorm';
import ms, { StringValue } from 'ms';
import { Response } from 'express';

@Injectable()
export class GuestAuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private cartService: CartService,
    private tableService: TableService,

    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) { }

  createRefreshToken(payload: any) {
    const refresh_token_guest = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as StringValue) / 1000
    })
    return refresh_token_guest;
  }

  async updateUserToken(refreshTokenGuest: string, _id: number) {
    return await this.guestRepository.update(
      { guest_id: _id },
      { refresh_token: refreshTokenGuest }
    );
  }

  async findGuestByToken(refreshToken: string) {
    return await this.guestRepository.findOne({
      where: { refresh_token: refreshToken },
      select: {
        guest_id: true,
        guest_name: true,
        cart_id: true,
        table_id: true
      }
    });
  }

  async login(guestName: string, table_id: number, response: Response) {

    const newCart = await this.cartService.create();
    const guest = await this.guestRepository.save({
      guest_name: guestName,
      cart_id: newCart.cart_id,
      table_id: table_id
    });

    const table = await this.tableService.findOne(table_id);

    const payload = {
      sub: "token login",
      iss: "from server",
      guest_id: guest.guest_id,
      guest_name: guest.guest_name,
      cart_id: guest.cart_id,
      table_id: guest.table_id,
      table_name: table?.table_name
    };

    const refresh_token = this.createRefreshToken(payload)
    // update user token with refresh token
    await this.updateUserToken(refresh_token, guest.guest_id);

    // set cookie
    response.cookie('refresh_token_guest', refresh_token, {
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as StringValue),
      httpOnly: true
    })

    return {
      access_token_guest: this.jwtService.sign(payload),
      guest: {
        guest_id: guest.guest_id,
        guest_name: guest.guest_name,
        cart_id: guest.cart_id,
        table_id: guest.table_id,
        table_name: table?.table_name
      }
    };
  }

  async processNewToken(refreshToken: string, response: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
      });

      let guest = await this.findGuestByToken(refreshToken);
      if (guest) {
        const table = await this.tableService.findOne(guest.table_id);
        const payload = {
          sub: "token refresh",
          iss: "from server",
          guest_id: guest.guest_id,
          guest_name: guest.guest_name,
          cart_id: guest.cart_id,
          table_id: guest.table_id,
          table_name: table?.table_name
        };

        const refresh_token = this.createRefreshToken(payload)
        // update user token with refresh token
        await this.updateUserToken(refresh_token, guest.guest_id);

        // set cookie
        response.clearCookie('refresh_token_guest');
        response.cookie('refresh_token_guest', refresh_token, {
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as StringValue),
          httpOnly: true
        })

        return {
          access_token_guest: this.jwtService.sign(payload),
          guest: {
            guest_id: guest.guest_id,
            guest_name: guest.guest_name,
            cart_id: guest.cart_id,
            table_id: guest.table_id,
            table_name: table?.table_name
          }
        };
      }
      else {
        throw new NotFoundException('Not found user')
      }
    } catch (error) {
      throw new BadRequestException('Refresh token invalid. Please login')
    }
  }
}
