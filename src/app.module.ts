import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './modules/account/account.module';
import { TableModule } from './modules/table/table.module';
import { OrderModule } from './modules/order/order.module';
import { DishModule } from './modules/dish/dish.module';
import { GuestModule } from './modules/guest/guest.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { CartModule } from './modules/cart/cart.module';
import { GuestAuthModule } from './modules/guest/guest_auth/guest_auth.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the app
      envFilePath: '.env', // Path to your .env file
    }),

    // Import other modules
    AccountModule,
    TableModule,
    OrderModule,
    DishModule,
    GuestModule,
    TransactionModule,
    GuestAuthModule,

    // Configure TypeORM dynamically using ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig, // Pass the function to configure TypeORM
    }),

    AuthModule,

    FileModule,

    CartModule,

    CartItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }