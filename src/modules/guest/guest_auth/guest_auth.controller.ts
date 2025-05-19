import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req, Query } from '@nestjs/common';
import { GuestAuthService } from './guest_auth.service';
import { Public, ResponseMessage, SkipTransform } from '@/decorator/customize';
import { Request, Response } from 'express';
import { JwtGuestAuthGuard } from './guard/jwt-guest-auth.guard';
import { GuestService } from '../guest.service';
import { DishService } from '@/modules/dish/dish.service';

@Controller('guest-auth')
export class GuestAuthController {
  constructor(
    private readonly guestAuthService: GuestAuthService,
    private guestService: GuestService,
    private dishService: DishService
  ) { }

  @Public()
  @Get('refresh')
  @ResponseMessage('Get guest by refresh token')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const refreshToken = request.cookies['refresh_token_guest'];
    return this.guestAuthService.processNewToken(refreshToken, response);
  }

  @Public()
  @UseGuards(JwtGuestAuthGuard)
  @ResponseMessage('Get guest information')
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.guestService.findOne(req.user.guest_id);
  }

  @Public()
  @ResponseMessage('Guest login')
  @Post('login')
  login(
    @Body('guest_name') guest_name: string,
    @Body('table_id') table_id: number,
    @Res({ passthrough: true }) response: Response

  ) {
    return this.guestAuthService.login(guest_name, table_id, response);
  }

  @Get('menu')
  @Public()
  @ResponseMessage('Get menu by guest id')
  @UseGuards(JwtGuestAuthGuard)
  getMenu(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 6,
    @Query('category') category: 'Chicken' | 'Water' = 'Chicken',
    @Query('status') status: 'Available' | 'Unavailable' = 'Available',
    @Query('search') search: string = '',
    @Query('sort') sort: 'ASC' | 'DESC' = 'ASC'
  ) {
    return this.dishService.findAll(page, limit, category, status, search, sort);
  }

  @Post('cart')
  @Public()
  @UseGuards(JwtGuestAuthGuard)
  @ResponseMessage('Add dish into cart')
  addItemIntoCart(
    @Req() req: any,
    @Body('dish_id') dish_id: number
  ) {
    return this.guestAuthService.addItemIntoCart(+req.user.cart_id, +dish_id);
  }

  @Get('cart')
  @Public()
  @UseGuards(JwtGuestAuthGuard)
  @ResponseMessage('Get all dish cart')
  getCart(
    @Req() req: any,
  ) {
    return this.guestAuthService.getAllItemCart(+req.user.cart_id);
  }

  @Patch('cart')
  @Public()
  @UseGuards(JwtGuestAuthGuard)
  @ResponseMessage('Update dish in cart')
  updateDishInCart(
    @Req() req: any,
    @Body('dish_id') dish_id: number,
    @Body('quantity') quantity: number,
  ) {
    return this.guestAuthService.updateDishInCart(+req.user.cart_id, dish_id, quantity);
  }


  @Delete('cart/:id')
  @Public()
  @UseGuards(JwtGuestAuthGuard)
  @ResponseMessage('Delete dish in cart')
  deleteDishInCart(
    @Req() req: any,
    @Param('id') id: string
  ) {
    return this.guestAuthService.deleteDishInCart(+req.user.cart_id, +id);
  }


  @Post('order')
  @Public()
  @UseGuards(JwtGuestAuthGuard)
  @ResponseMessage('Guest order')
  orderAllItemInCart(
    @Req() req: any,
  ) {
    return this.guestAuthService.orderAllItemInCart(+req.user.guest_id, +req.user.table_id, +req.user.cart_id);
  }

  @Post('order/callback/:order_id')
  @Public()
  @SkipTransform()
  @ResponseMessage('Guest order callback')
  orderCallback(
    @Body() body: any,
    @Param('order_id') order_id: string
  ) {
    return this.guestAuthService.orderCallback(body, +order_id);
  }

  @Public()
  @ResponseMessage('Delete guest cookie')
  @Get('cookie/delete')
  deleteCookie(
    @Res({ passthrough: true }) response: Response

  ) {
    response.clearCookie('refresh_token_guest');
    return {
      refresh_token_guest: null,
    };
  }



}
