import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) { }

  @Post()
  create(@Body() createDishDto: CreateDishDto) {
    return this.dishService.create(createDishDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 6,
    @Query('category') category: 'Chicken' | 'Water' = 'Chicken',
    @Query('status') status: 'Available' | 'Unavailable' = 'Available',
    @Query('search') search: string = '',
    @Query('sort') sort: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.dishService.findAll(page, limit, category, status, search, sort);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishService.update(+id, updateDishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishService.remove(+id);
  }
}
