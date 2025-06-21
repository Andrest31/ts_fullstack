/* eslint-disable prettier/prettier */
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  // likes.service.ts
async createLike(catId: string, userId: number) {
  // Проверяем, не существует ли уже такой лайк
  const existingLike = await this.likesRepository.findOne({
    where: {
      cat_id: catId,
      user: { id: userId }
    }
  });

  if (existingLike) {
    throw new ConflictException('You already liked this cat');
  }

  const like = this.likesRepository.create({
    cat_id: catId,
    user: { id: userId }
  });

  return this.likesRepository.save(like);
}

  async getUserLikes(userId: number): Promise<Like[]> {
    return this.likesRepository.find({
      where: { user: { id: userId } },
      relations: ['user']
    });
  }

  async remove(catId: string, userId: number): Promise<void> {
    await this.likesRepository.delete({ 
      cat_id: catId,
      user: { id: userId }
    });
  }
}