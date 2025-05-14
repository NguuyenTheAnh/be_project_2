import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { ResponseMessage } from '@/decorator/customize';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) { }

  @Post()
  @ResponseMessage('Create table')
  create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.create(createTableDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 6,
    @Query('payment_status') payment_status: 'Paid' | 'Unpaid',
    @Query('status') status: 'Available' | 'Unavailable',
    @Query('search') search: string = '',
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
  ) {
    return this.tableService.findAll(page, limit, payment_status, status, search, sort);
  }

  @Get(':id')
  @ResponseMessage('Get table by ID')
  findOne(@Param('id') id: string) {
    return this.tableService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('Update table')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tableService.update(+id, updateTableDto);
  }

  @Delete(':id')
  @ResponseMessage('Delete table')
  remove(@Param('id') id: string) {
    return this.tableService.remove(+id);
  }
}
