import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // 💡 User 엔티티 경로에 맞게 수정해주세요.

@Module({
  // 💡 이 부분이 핵심입니다!
  // UsersModule에서 User 엔티티와 관련된 Repository를 사용할 수 있도록 등록합니다.
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],

  exports: [UsersService],
})
export class UsersModule {}