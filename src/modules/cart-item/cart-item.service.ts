import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class CartItemService {

  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) { }

  async create(createCartItemDto: CreateCartItemDto) {
    const newCartItem = this.cartItemRepository.create(createCartItemDto);
    return await this.cartItemRepository.save(newCartItem);
  }

  async findAll(queryData: any) {
    const { cart_id, dish_id } = queryData;
    const whereCondition: any = {};
    if (cart_id) whereCondition.cart_id = +cart_id;
    if (dish_id) whereCondition.dish_id = +dish_id;
    return await this.cartItemRepository.find({
      where: whereCondition,
      relations: ["cart", "dish"]
    })
  }

  async update(updateCartItemDto: UpdateCartItemDto) {
    const { cart_id, dish_id, quantity } = updateCartItemDto;
    return await this.cartItemRepository.update(
      { cart_id, dish_id },
      {
        quantity
      },
    );
  }

  async remove(cart_id: number, dish_id: number) {
    const cartItem = this.cartItemRepository.findOneBy({ cart_id, dish_id });
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    return await this.cartItemRepository.delete({ cart_id, dish_id });
  }
}
