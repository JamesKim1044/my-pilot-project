import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '사용자 이메일 (고유값)', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '사용자 비밀번호 (최소 8자)', example: 'secure1234' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
