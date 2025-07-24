import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: "aws-0-eu-central-1.pooler.supabase.com",
        port: 6543,
        username: "postgres.fnwpmwqzspbqsjyjpsrj",
        password: "Jesa2025",
        database: "postgres",
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: true,
      }),
    }),
  ],
  providers: [ClerkClientProvider],
})
export class SupabaseModule {}