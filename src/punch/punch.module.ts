import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Punch } from '../models/punch.entity';
import { PunchService } from './punch.service';
import { PunchController } from './punch.controller';
import { User } from '../models/user.entity';
import { System } from '../models/system.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Punch, User, System])],
  providers: [PunchService],
  controllers: [PunchController],
  exports: [PunchService],
})
export class PunchModule {}