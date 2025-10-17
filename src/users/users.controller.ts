// src/users/users.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // 💡 수정: async 키워드 추가 및 반환 타입을 Promise<User>로 변경
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // 💡 수정: 비동기 호출이므로 await 적용
    return await this.usersService.create(createUserDto);
  }
}