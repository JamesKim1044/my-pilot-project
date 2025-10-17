import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates a user based on email and password.
   * @param email The user's email
   * @param pass The user's password
   * @returns The user object without the password, or null if validation fails
   */
  async validateUser(email: string, pass: string): Promise<any> {
    // 💡 변경점 1: username 대신 email로 사용자를 조회합니다.
    const user = await this.usersService.findOneByEmail(email);

    // 💡 User 엔티티의 `comparePassword` 메서드를 활용할 수도 있습니다.
    // if (user && (await user.comparePassword(pass))) {
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result; // 비밀번호를 제외한 사용자 정보 반환
    }
    return null;
  }

  /**
   * Generates a JWT for a given user.
   * @param user The user object from the validation step
   * @returns An object containing the access token
   */
  async login(user: any) {
    // 💡 변경점 2: JWT payload에 username 대신 email, userId 대신 id를 사용합니다.
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
