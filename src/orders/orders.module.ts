import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersSchema } from './schema/orders.schema';
import { JwtModule } from '@nestjs/jwt';
import { TcpTransport } from '../../core/commons/tcp-transport';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { JwtStrategy } from 'core/guard/jwt.strategy';

@Module({
  imports:[
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Orders', schema: OrdersSchema }]),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME')
        }
      }),
    }),
  ],
  providers: [
    OrdersService, 
    OrdersResolver,
    TcpTransport,
    JwtStrategy,
    {
      provide: 'PRODUCT_SERVICE',
      inject:[ConfigService],
      useFactory:  async (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('TCP_PRODUCT_SERVICE_HOST'),
            port: configService.get<number>('TCP_PRODUCT_SERVICE_PORT')
          },
      }),
    },
  ]
})
export class OrdersModule {}
