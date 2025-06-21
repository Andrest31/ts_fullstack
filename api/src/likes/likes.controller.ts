/* eslint-disable prettier/prettier */
import { Controller, UseGuards, Get, Post, Body, Req, Delete, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { LikesService } from './likes.service';
import { User } from '../users/user.entity';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  getUserLikes(@Req() req: Request & { user: User }) {
    return this.likesService.getUserLikes(req.user.id);
  }

  @Post()
  createLike(
    @Body() body: { cat_id: string },
    @Req() req: Request & { user: User }
  ) {
    return this.likesService.createLike(body.cat_id, req.user.id);
  }

  @Delete(':cat_id')
  remove(
    @Param('cat_id') catId: string,
    @Req() req: Request & { user: User }
  ) {
    return this.likesService.remove(catId, req.user.id);
  }
}