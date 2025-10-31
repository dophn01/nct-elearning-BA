import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || 'http://localhost:3000',
    credentials: true,
  });

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Set global prefix
  app.setGlobalPrefix('api');

  // Handle root path and favicon for platform health checks
  const expressApp = app.getHttpAdapter().getInstance();
  if (expressApp && typeof expressApp.get === 'function') {
    expressApp.get('/', (_req: any, res: any) => {
      res.status(200).send('NC Telearning API is running. Visit /api for endpoints.');
    });
    if (typeof expressApp.head === 'function') {
      expressApp.head('/', (_req: any, res: any) => res.status(200).end());
    }
    expressApp.get('/favicon.ico', (_req: any, res: any) => res.status(204).end());
  }

  const port = configService.get('PORT') || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📚 NC Telearning API is ready!`);
}
bootstrap();
