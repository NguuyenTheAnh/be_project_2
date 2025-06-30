import { Module } from '@nestjs/common';
import { GuestAuthService } from './guest_auth.service';
import { GuestAuthController } from './guest_auth.controller';
import { CartModule } from '@/modules/cart/cart.module';
import { TableModule } from '@/modules/table/table.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from '../entities/guest.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';
import { JwtGuestAuthGuard } from './guard/jwt-guest-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtGuestStrategy } from './passport/jwt-guest.strategy';
import { GuestModule } from '../guest.module';
import { DishModule } from '@/modules/dish/dish.module';
import { CartItemModule } from '@/modules/cart-item/cart-item.module';
import { OrderModule } from '@/modules/order/order.module';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { WebSocketModule } from '@/websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guest]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRE') as StringValue) / 1000,
        },
      }),
    }),
    GuestModule,
    CartItemModule,
    TransactionModule,
    OrderModule,
    DishModule,
    CartModule,
    TableModule,
    WebSocketModule,
  ],
  controllers: [GuestAuthController],
  providers: [GuestAuthService, JwtGuestStrategy],
})
export class GuestAuthModule { }
