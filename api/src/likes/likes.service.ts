/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async findAll(): Promise<Like[]> {
    return this.likesRepository.find();
  }

  async create(catId: string): Promise<Like> {
  if (!catId) {
    throw new BadRequestException('cat_id is required');
  }
  
  const like = this.likesRepository.create({ 
    cat_id: catId // Явно указываем поле
  });
  
  return this.likesRepository.save(like);
}

  async remove(catId: string): Promise<void> {
    await this.likesRepository.delete({ cat_id: catId });
  }
}