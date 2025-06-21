/* eslint-disable prettier/prettier */
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { User } from '../users/user.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async createLike(catId: string, user: User): Promise<Like> {
    const existingLike = await this.likesRepository.findOne({ 
      where: { 
        cat_id: catId,
        user: { id: user.id }
      }
    });

    if (existingLike) {
      throw new ConflictException('You already liked this cat');
    }

    const like = this.likesRepository.create({
      cat_id: catId,
      user: user
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