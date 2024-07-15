import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const isProduction = process.env.NODE_ENV === 'production';

  console.log(process.env.DB_PORT, 'process env');
  const baseURL = isProduction
    ? process.env.PRODUCTION_URL
    : process.env.DEVELOPMENT_URL;
  const port = isProduction
    ? Number(process.env.PRODUCTION_PORT) || 8081
    : Number(process.env.DEVELOPMENT_PORT) || 8080;

  app.enableCors({
    origin: ['http://31.129.63.84:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(port);
  console.log(`Server running on ${baseURL}:${port}`);
}

bootstrap();
