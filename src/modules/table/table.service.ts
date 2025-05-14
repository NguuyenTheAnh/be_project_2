import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Table } from './entities/table.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>
  ) { }

  async create(createTableDto: CreateTableDto) {
    const newTable = this.tableRepository.create(createTableDto);
    return await this.tableRepository.save(newTable);
  }

  async findAll(
    page: number = 1,
    limit: number = 6,
    payment_status: string,
    status: string,
    search: string,
    sort: 'asc' | 'desc',
  ) {
    const offset = (page - 1) * limit;

    const whereCondition: any = {};
    if (payment_status) whereCondition.payment_status = payment_status;
    if (status) whereCondition.status = status;
    if (search) whereCondition.table_name = ILike(`%${search}%`);

    const [tables, totalTables] = await this.tableRepository.findAndCount({
      where: whereCondition,
      take: limit,
      skip: offset,
      order: {
        capacity: sort,
      },
    });

    const totalPage = Math.ceil(totalTables / limit);

    return {
      totalTables,
      totalPage,
      currentPage: page,
      limit,
      tables,
    };
  }

  async findOne(id: number) {
    return await this.tableRepository.findOneBy({ table_id: id });
  }

  async update(id: number, dto: UpdateTableDto) {
    const table = await this.tableRepository.findOneBy({ table_id: id });
    if (!table) throw new NotFoundException('Table not found');
    return await this.tableRepository.update(
      { table_id: id },
      dto
    );
  }

  async remove(id: number) {
    const table = await this.tableRepository.findOneBy({ table_id: id });
    if (!table) throw new NotFoundException('Table not found');
    return await this.tableRepository.softDelete({ table_id: id });
  }
}
