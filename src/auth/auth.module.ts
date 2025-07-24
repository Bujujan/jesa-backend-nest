import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import Message from './auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';
import { ClerkStrategy } from './clerk.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), PassportModule, ConfigModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, ClerkStrategy, ClerkClientProvider],
  exports: [PassportModule]
})
export class AuthModule {}