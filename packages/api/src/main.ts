import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET)); // 웹 서버가 클라이언트로부터 받은 요청 헤더에 포함된 쿠키 문자열을 해석하여, 서버에서 쉽게 사용할 수 있도록 JavaScript 객체로 변환하는 역할
  await app.listen(process.env.PORT ?? 8000); // process.env 안먹는데 나중에 확인
}
bootstrap();
