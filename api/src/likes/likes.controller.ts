/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';

@Controller('likes')
export class LikesController {
  @Get()
  getLikes() {
    return [{ id: 1, cat_id: 'test' }]; // Тестовые данные
  }
}