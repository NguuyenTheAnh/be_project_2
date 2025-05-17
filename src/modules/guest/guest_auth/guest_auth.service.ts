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
import { CartItemService } from '@/modules/cart-item/cart-item.service';
import { DishService } from '@/modules/dish/dish.service';

@Injectable()
export class GuestAuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private cartService: CartService,
    private tableService: TableService,
    private cartItemService: CartItemService,
    private dishService: DishService,

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
    //update table status
    await this.tableService.update(table_id, { status: "Unavailable", payment_status: "Unpaid" })

    //create new guest and guest's cart
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

  async addItemIntoCart(cart_id: number, dish_id: number) {
    const cartItem = await this.cartItemService.findAll({ cart_id, dish_id });
    if (cartItem.length === 0) {
      const newCartItem = await this.cartItemService.create({ cart_id, dish_id, quantity: 1 });
      //update total price in cart
      const { price } = await this.dishService.findOne(dish_id);
      const cart = await this.cartService.findOne(cart_id);
      if (cart) {
        const { total_cart } = cart;
        await this.cartService.update(cart_id, { total_cart: total_cart + price });
        return await this.cartService.findOne(cart_id);
      }
    }
    else {
      const currentQuantity = cartItem[0].quantity;
      await this.cartItemService.update({ cart_id, dish_id, quantity: currentQuantity + 1 });

      //update total cart
      const { price } = await this.dishService.findOne(dish_id);
      const cart = await this.cartService.findOne(cart_id);
      if (cart) {
        const { total_cart } = cart;
        await this.cartService.update(cart_id, { total_cart: total_cart + price });
        return await this.cartService.findOne(cart_id);
      }
      return;
    }
  }

  async getAllItemCart(cart_id: number) {
    return await this.cartItemService.findAll({ cart_id });
  }

  async updateDishInCart(cart_id: number, dish_id: number, quantity: number) {
    const cartItem = await this.cartItemService.findAll({ cart_id, dish_id });
    const currentQuantity = cartItem[0].quantity;
    //update total price in cart
    const { price } = await this.dishService.findOne(dish_id);
    const cart = await this.cartService.findOne(cart_id);
    if (cart) {
      const { total_cart } = cart;
      await this.cartService.update(cart_id, { total_cart: total_cart + price * (quantity - currentQuantity) });
      return await this.cartItemService.update({ cart_id, dish_id, quantity });;
    }
    return await this.cartItemService.update({ cart_id, dish_id, quantity });;
  }

  async deleteDishInCart(cart_id: number, dish_id: number) {
    //update total price in cart
    const cartItem = await this.cartItemService.findAll({ cart_id, dish_id });
    const currentQuantity = cartItem[0].quantity;
    const { price } = await this.dishService.findOne(dish_id);
    const cart = await this.cartService.findOne(cart_id);
    if (cart) {
      const { total_cart } = cart;
      await this.cartService.update(cart_id, { total_cart: total_cart - price * currentQuantity });
      return await this.cartItemService.remove(cart_id, dish_id);
    }
    return await this.cartItemService.remove(cart_id, dish_id);
  }
}
