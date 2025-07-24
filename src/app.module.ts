import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { ClerkClientProvider } from './providers/clerk-client.provider';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { ProjectModule } from './projets/project.module';
import { ProjectUserModule } from './projectuser/projectuser.module';
import { SystemModule } from './system/system.module';
import { PunchModule } from './punch/punch.module';
import { UserModule } from './user/user.module';
import { Discipline } from './models/discipline.entity';
import { DisciplineModule } from './discipline/discipline.module';
// import { UsersService } from './users/users.service';

// Define Zod schema for environment variables
const envSchema = z.object({
  POSTGRES_HOST: z.string(),
  
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  PORT: z.number().optional(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config: Record<string, any>) => {
        const parsed = envSchema.safeParse(config);
        if (!parsed.success) {
          throw new Error(`Config validation error: ${JSON.stringify(parsed.error.format())}`);
        }
        return parsed.data;
      },
      isGlobal: true,
    }),
    SupabaseModule,
    AuthModule,
    ProjectUserModule,
    ProjectModule,
    SystemModule,
    PunchModule,
    UserModule,
    DisciplineModule,

    
  ],
  controllers: [AppController],
  providers: [AppService, ClerkClientProvider],
})
export class AppModule {}