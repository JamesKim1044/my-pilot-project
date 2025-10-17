// src/main.ts

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // 💡 Swagger 모듈 임포트
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. DocumentBuilder를 사용하여 문서 설정
  const config = new DocumentBuilder()
    .setTitle('My NestJS Pilot API') // 문서 제목
    .setDescription('NestJS 샘플 프로젝트 API 문서입니다.') // 문서 설명
    .setVersion('1.0') // API 버전
    .addTag('users') // 기본 태그 추가 (선택 사항)
    .build();

  // 2. SwaggerModule.createDocument()로 문서 객체 생성
  const document = SwaggerModule.createDocument(app, config);

  // 3. SwaggerModule.setup()으로 Swagger UI 엔드포인트 설정
  // 'api' 경로에 Swagger UI를 마운트합니다.
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();