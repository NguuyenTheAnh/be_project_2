import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req, Query } from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Request, Response } from 'express';
import { Public, ResponseMessage } from '@/decorator/customize';
import { JwtGuestAuthGuard } from './guest_auth/guard/jwt-guest-auth.guard';
import { DishService } from '../dish/dish.service';

@Controller('guest')
export class GuestController {
  constructor(
    private readonly guestService: GuestService,
    private dishService: DishService
  ) { }

  @Post()
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestService.create(createGuestDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.guestService.findAll();
  }

  @Public()
  @ResponseMessage('Get guest by id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestService.update(+id, updateGuestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestService.remove(+id);
  }
}
