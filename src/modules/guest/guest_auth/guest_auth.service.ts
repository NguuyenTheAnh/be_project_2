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
import { OrderService } from '@/modules/order/order.service';
import { TransactionService } from '@/modules/transaction/transaction.service';
import { NotificationGateway } from '@/websocket/websocket.gateway';

const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment

@Injectable()
export class GuestAuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private cartService: CartService,
    private tableService: TableService,
    private cartItemService: CartItemService,
    private dishService: DishService,
    private orderService: OrderService,
    private transactionService: TransactionService,
    private notificationGateway: NotificationGateway,


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

  async orderAllItemInCart(guest_id: number, table_id: number, cart_id: number) {
    //create a new order
    const cart = await this.cartService.findOne(cart_id);
    const total_price = cart?.total_cart ?? 0;
    const newOrder = await this.orderService.create({
      guest_id,
      table_id,
      status: 'Pending',
      total_order: total_price,
    });

    //create payment for guest
    const order = await this.orderService.findOne(newOrder.order_id);
    if (!order) {
      throw new NotFoundException('Not found order created')
    }

    const embed_data = {
      redirecturl: `${this.configService.get<string>('FRONTEND_URL')}/wish?table_id=${order.table_id}`
    };

    const items = order.guest.cart.cartItems.map((item) => ({
      itemid: item.dish_id,
      itemname: item.dish.dish_name,
      itemprice: item.dish.dish_name,
      itemquantity: item.quantity
    }));

    const transId = Math.floor(Math.random() * 1000000);;

    const trans: {
      app_id: number | undefined,
      app_trans_id: string,
      app_user: string,
      app_time: number,
      item: string,
      embed_data: string,
      amount: number,
      description: string,
      bank_code: string,
      mac?: string
      callback_url?: string
    } = {
      app_id: +(this.configService.get<string>('APPID') ?? 0),
      app_trans_id: `${moment().format('YYMMDD')}_${transId}`, // mã giao dich có định dạng yyMMdd_xxxx
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: order.total_order,
      description: `Chickend Restaurant - Payment for the order #${transId}`,
      bank_code: "",
      callback_url: `${this.configService.get<string>('BACKEND_URL')}/api/v1/guest-auth/order/callback/${order.order_id}`
    };

    // appid|apptransid|appuser|amount|apptime|embeddata|item
    const data = this.configService.get<string>('APPID') + "|" + trans.app_trans_id + "|" + trans.app_user + "|" + trans.amount + "|" + trans.app_time + "|" + trans.embed_data + "|" + trans.item;
    trans.mac = CryptoJS.HmacSHA256(data, this.configService.get<string>('KEY1')).toString();

    try {
      const result = await axios.post(`${this.configService.get<string>('SANDBOX_URL')}/v2/create`, null, { params: trans });
      return result.data;
    } catch (error) {
      console.log(">>>Check error: ", error);
    }
  }

  async orderCallback(body: any, order_id: number) {
    let result: { return_code: number, return_message: string } = { return_code: 0, return_message: '' };

    try {
      let dataStr = body.data;
      let reqMac = body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, this.configService.get<string>('KEY2')).toString();
      console.log("mac =", mac);


      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.return_code = -1;
        result.return_message = "mac not equal";
      }
      else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        let dataJson = JSON.parse(dataStr);
        console.log(">>>Check data:", dataJson);
        console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

        //update order table
        this.orderService.update(order_id, { status: 'Completed' });

        //update table
        const order = await this.orderService.findOne(order_id);
        if (!order) {
          throw new NotFoundException('Not found payment ordered')
        }
        this.tableService.update(order.table_id, { payment_status: 'Paid' });

        // Get table information for notification
        const table = await this.tableService.findOne(order.table_id);

        // Send real-time notification to admin
        this.notificationGateway.sendPaymentSuccessNotification({
          table_id: order.table_id,
          table_name: table?.table_name || `Bàn ${order.table_id}`,
          order_id: order.order_id,
          amount: order.total_order,
          guest_name: order.guest?.guest_name || 'Khách hàng',
          timestamp: new Date().toISOString(),
        });

        // Send table status update notification
        this.notificationGateway.sendTableStatusUpdate({
          table_id: order.table_id,
          table_name: table?.table_name || `Bàn ${order.table_id}`,
          status: table?.status || 'Unavailable',
          payment_status: 'Paid',
        });

        // Send order status update notification
        this.notificationGateway.sendOrderStatusUpdate({
          order_id: order.order_id,
          table_name: table?.table_name || `Bàn ${order.table_id}`,
          status: 'Completed',
          total_order: order.total_order,
        });

        //create transaction
        const allTransactions = await this.transactionService.findAll();
        console.log(allTransactions.length);


        if (allTransactions.length === 0) {
          this.transactionService.create({
            transaction_id: dataJson.app_trans_id,
            transaction_date: dataJson.app_time,
            id_zalopay: dataJson.zp_trans_id,
            table_id: order.table_id,
            amount_in: order.total_order,
            amount_out: 0,
            accumulated: +(order.total_order),
          })
        }
        else {
          const currentAccumulated = allTransactions[0].accumulated;
          this.transactionService.create({
            transaction_id: dataJson.app_trans_id,
            transaction_date: dataJson.app_time,
            id_zalopay: dataJson.zp_trans_id,
            table_id: order.table_id,
            amount_in: order.total_order,
            amount_out: 0,
            accumulated: +(+(currentAccumulated) + (+(order.total_order))),
          })
        }

        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (ex) {
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    return result;
  }
}
