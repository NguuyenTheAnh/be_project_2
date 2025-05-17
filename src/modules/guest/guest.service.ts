import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { TableService } from '../table/table.service';

@Injectable()
export class GuestService {
  constructor(
    private cartService: CartService,
    private configService: ConfigService,
    private tableService: TableService,

    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) { }

  create(createGuestDto: CreateGuestDto) {
    return 'This action adds a new guest';
  }

  findAll() {
    return `This action returns all guest`;
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Guest id is required');
    }
    return await this.guestRepository.findOne({
      where: { guest_id: id },
      select: {
        guest_id: true,
        guest_name: true,
        table_id: true,
        cart_id: true,
      },
      relations: ['table', 'cart'],
    });
  }

  update(id: number, updateGuestDto: UpdateGuestDto) {
    return `This action updates a #${id} guest`;
  }

  remove(id: number) {
    return `This action removes a #${id} guest`;
  }
}
