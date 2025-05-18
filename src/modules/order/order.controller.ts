import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public, ResponseMessage } from '@/decorator/customize';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Public()
  @ResponseMessage('Create a new order')
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Public()
  @ResponseMessage('Find all orders')
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 6,
    @Query('status') status: 'Pending' | 'Completed',
    @Query('sort') sort: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.orderService.findAll(page, limit, status, sort);
  }

  @Public()
  @ResponseMessage('Find order by ID')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Public()
  @ResponseMessage('Update order')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Public()
  @ResponseMessage('Delete order')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
