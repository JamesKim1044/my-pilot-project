import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    // 1. ConfigService에서 JWT 시크릿 키를 먼저 가져옵니다.
    const secret = configService.get<string>('JWT_SECRET');

    // 2. 시크릿 키가 .env 파일에 설정되어 있는지 확인합니다.
    //    만약 설정되어 있지 않다면, 애플리케이션 실행을 중지시키고 에러를 던집니다.
    if (!secret) {
      throw new Error('JWT_SECRET is not set in the environment variables!');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 3. 검증된 시크릿 키를 전달하여 타입 에러를 해결합니다.
      secretOrKey: secret,
    });
  }

  // This method runs after the token has been successfully verified.
  // The return value is attached to the Request object as `req.user`.
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}

