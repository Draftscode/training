import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: config.get('DATABASE_PORT'),
        database: config.get('DATABASE_NAME'),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        entities: [join(__dirname, '**', '*.entity{.js,.ts}')],
        migrations: [],
        subscribers: [],
        migrationsTableName: 'typeorm_migrations',
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [UserController, AppController],
  providers: [AppService],
})
export class AppModule { }
