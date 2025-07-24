import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { System } from '../models/system.entity';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { Discipline } from '../models/discipline.entity';
import { Punch } from '../models/punch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([System, Discipline, Punch])],
  providers: [SystemService],
  controllers: [SystemController],
  exports: [SystemService],
})
export class SystemModule {}