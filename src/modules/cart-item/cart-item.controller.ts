import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Public, ResponseMessage } from '@/decorator/customize';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) { }

  @Public()
  @Post()
  @ResponseMessage('Create cart item')
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemService.create(createCartItemDto);
  }

  @Public()
  @Get()
  @ResponseMessage('Get cart items')
  findAll(
    @Query() queryData: any,
  ) {
    return this.cartItemService.findAll(queryData);
  }

  @Public()
  @Patch()
  @ResponseMessage('Update cart item by id')
  update(
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    return this.cartItemService.update(updateCartItemDto);
  }

  @Public()
  @Delete()
  @ResponseMessage('Delete cart item by id')
  remove(
    @Query('cart_id') cart_id: string,
    @Query('dish_id') dish_id: string,
  ) {
    return this.cartItemService.remove(+cart_id, +dish_id);
  }
}
