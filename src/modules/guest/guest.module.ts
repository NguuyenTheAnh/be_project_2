import { Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { CartModule } from '../cart/cart.module';
import { Table } from 'typeorm';
import { TableModule } from '../table/table.module';
import { GuestAuthModule } from './guest_auth/guest_auth.module';
import { PassportModule } from '@nestjs/passport';
import { DishModule } from '../dish/dish.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guest]),

    CartModule,
    TableModule,
    DishModule,
  ],
  controllers: [GuestController],
  providers: [GuestService],
  exports: [GuestService],
})
export class GuestModule { }
