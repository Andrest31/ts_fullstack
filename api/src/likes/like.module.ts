import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { LikesController } from './likes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  controllers: [LikesController],
})
export class LikesModule {}