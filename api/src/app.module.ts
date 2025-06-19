/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Like } from './likes/like.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'cat-pinterest-api-pg', // имя сервиса из compose.yaml
      port: 5432,
      username: 'postgres',
      password: '1', // как в compose.yaml
      database: 'support_lk_db', // как в compose.yaml
      entities: [User, Like], // ваши сущности
      synchronize: true, // автоматическое создание таблиц (только для разработки!)
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
