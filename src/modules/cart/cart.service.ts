import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) { }

  async create() {
    return await this.cartRepository.save({
      total_cart: 0,
    });
  }

  findAll() {
    return `This action returns all cart`;
  }

  async findOne(id: number) {
    return await this.cartRepository.findOneBy({ cart_id: id });
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    return await this.cartRepository.update(
      { cart_id: id },
      {
        ...updateCartDto
      }
    );
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
