import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; // 👈 1. UsersModule을 임포트합니다.
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // 💡 이 부분이 핵심입니다!
    // UsersModule을 임포트하여 AuthModule에서 UsersService를 사용할 수 있게 합니다.
    UsersModule, // 👈 2. 여기에 UsersModule을 추가합니다.
    PassportModule,
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', // 실제로는 환경변수로 관리하세요.
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
