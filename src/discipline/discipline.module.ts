import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discipline } from '../models/discipline.entity';
import { DisciplineService } from './discipline.service';
import { DisciplineController } from './discipline.controller';
import { System } from '../models/system.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discipline, System])],
  providers: [DisciplineService],
  controllers: [DisciplineController],
  exports: [DisciplineService],
})
export class DisciplineModule {}