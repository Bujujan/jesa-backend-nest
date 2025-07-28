import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow all origins for testing; use specific origin (e.g., 'http://localhost:19006') for production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(ClerkExpressWithAuth({
    jwtKey: process.env.CLERK_JWT_KEY,
  }));
  await app.listen(3000);
}
bootstrap();
