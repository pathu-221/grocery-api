import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  console.log({ path: join(__dirname, 'public') });

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://grocery.prathamaggarwal.me',
    ],
  });
  app.useStaticAssets(join(__dirname, '../../', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3001);
}
bootstrap();
