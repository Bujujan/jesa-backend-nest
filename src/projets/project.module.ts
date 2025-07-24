import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../models/project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectUser } from '../models/projectuser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectUser])],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}