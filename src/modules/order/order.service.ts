import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {

  }

  async create(createOrderDto: CreateOrderDto) {
    const newOrder = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(newOrder);
  }
  async findAll(
    page: number = 1,
    limit: number = 6,
    status: string,
    sort: 'ASC' | 'DESC',
  ) {
    const offset = (page - 1) * limit;

    const whereCondition: any = {};
    if (status) whereCondition.status = status;

    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.guest', 'guest')
      .addSelect([
        'guest.guest_id',
        'guest.guest_name',
        'guest.table_id',
        'guest.cart_id',
      ])
      .leftJoinAndSelect('order.table', 'table')
      .leftJoin('order.orderHandler', 'orderHandler')
      .addSelect([
        'orderHandler.account_id',
        'orderHandler.name',
        'orderHandler.email',
        'orderHandler.role',
        'orderHandler.phone',
        'orderHandler.is_active',
        'orderHandler.created_at',
        'orderHandler.updated_at',
        'orderHandler.deleted_at',
      ])
      .where(whereCondition)
      .take(limit)
      .skip(offset)
      .orderBy('order.updated_at', sort);

    const [orders, totalOrders] = await query.getManyAndCount();

    const totalPage = Math.ceil(totalOrders / limit);

    return {
      totalOrders,
      totalPage,
      currentPage: page,
      limit,
      orders,
    };
  }


  async findOne(id: number) {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.guest', 'guest')
      .addSelect([
        'guest.guest_id',
        'guest.guest_name',
        'guest.table_id',
        'guest.cart_id',
      ])
      .leftJoinAndSelect('order.table', 'table')
      .leftJoin('order.orderHandler', 'orderHandler')
      .addSelect([
        'orderHandler.account_id',
        'orderHandler.name',
        'orderHandler.email',
        'orderHandler.role',
        'orderHandler.phone',
        'orderHandler.is_active',
        'orderHandler.created_at',
        'orderHandler.updated_at',
        'orderHandler.deleted_at',
      ])
      //join cart table
      .leftJoin('guest.cart', 'cart')
      .addSelect(['cart.cart_id'])

      //join cartItem table
      .leftJoin('cart.cartItems', 'cartItem')
      .addSelect(['cartItem.cart_id', 'cartItem.dish_id', 'cartItem.quantity'])

      //join dish table
      .leftJoin('cartItem.dish', 'dish')
      .addSelect(['dish.dish_id', 'dish.dish_name', 'dish.price'])

      .where('order.order_id= :id', { id })
      .getOne();
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.orderRepository.update(
      { order_id: id },
      updateOrderDto
    );
  }

  async remove(id: number) {
    return await this.orderRepository.softDelete({ order_id: id });
  }
}
