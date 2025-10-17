// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module'; // 💡 UsersModule 임포트
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. 환경 변수 로드 (전역)
    ConfigModule.forRoot({ isGlobal: true }),
    
    // 2. TypeORM DB 연결 설정 (비동기)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        
        entities: [__dirname + '/**/*.entity{.ts,.js}'], 
        synchronize: true,
        logging: true,
      }),
    }),
    
    // 💡 수정 사항: Users 모듈 추가 (애플리케이션의 기능 모듈 로드)
    UsersModule,
    
    AuthModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}