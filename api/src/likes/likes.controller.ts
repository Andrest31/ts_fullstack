/* eslint-disable prettier/prettier */
// likes.controller.ts
import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { HashAuthGuard } from 'src/auth/hash-auth.guard';

@Controller('likes')
@UseGuards(HashAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  getAll() {
    return this.likesService.findAll();
  }

  @Post()
  create(@Body() dto: { cat_id: string }) {
    return this.likesService.create(dto.cat_id);
  }

  @Delete(':cat_id')
  remove(@Param('cat_id') catId: string) {
    return this.likesService.remove(catId);
  }
}