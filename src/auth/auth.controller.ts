import { Controller, Post, Request, UseGuards, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // 💡 UsersService 주입
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  /**
   * 💡 [추가된 최종 API]
   * @UseGuards(AuthGuard('jwt')) 데코레이터가 "문지기" 역할을 합니다.
   * 헤더에 유효한 JWT 토큰이 있어야만 이 API에 접근할 수 있습니다.
   * 토큰이 없거나 유효하지 않으면, 서버가 자동으로 401 Unauthorized 에러를 응답합니다.
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    // req.user는 JwtStrategy의 validate 메서드가 반환한 값입니다.
    // (예: { userId: 1, email: 'test@example.com' })
    const userId = req.user.userId;

    // 데이터베이스에서 최신 사용자 정보를 조회합니다 (비밀번호는 자동으로 제외됩니다).
    const user = await this.usersService.findOneById(userId);

    // 조회한 사용자 정보를 반환합니다.
    return user;
  }
}

