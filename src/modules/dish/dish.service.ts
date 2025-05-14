import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Dish } from './entities/dish.entity';

@Injectable()
export class DishService {

  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
  ) { }

  async create(createDishDto: CreateDishDto) {
    const newDish = this.dishRepository.create(createDishDto);
    return await this.dishRepository.save(newDish);
  }

  async findAll(
    page: number = 1,
    limit: number = 6,
    category: string,
    status: string,
    search: string,
    sort: 'asc' | 'desc',
  ) {
    const offset = (page - 1) * limit;

    const whereCondition: any = {};
    if (category) whereCondition.category = category;
    if (status) whereCondition.status = status;
    if (search) whereCondition.dish_name = ILike(`%${search}%`);

    const [dishes, totalDishes] = await this.dishRepository.findAndCount({
      where: whereCondition,
      take: limit,
      skip: offset,
      order: {
        price: sort,
      },
    });

    const totalPage = Math.ceil(totalDishes / limit);

    return {
      totalDishes,
      totalPage,
      currentPage: page,
      limit,
      dishes,
    };
  }


  async findOne(id: number) {
    const dish = await this.dishRepository.findOne({ where: { dish_id: id } });
    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }
    return dish;
  }

  async update(id: number, updateDishDto: UpdateDishDto) {
    await this.dishRepository.update(id, updateDishDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const table = await this.dishRepository.findOneBy({ dish_id: id });
    if (!table) throw new NotFoundException('Table not found');
    return await this.dishRepository.softDelete({ dish_id: id });
  }
}
