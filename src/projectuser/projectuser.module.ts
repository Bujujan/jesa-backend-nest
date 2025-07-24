import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUser } from '../models/projectuser.entity';
import { ProjectUserService } from './projectuser.service';
import { ProjectUserController } from './projectuser.controller';
import { Project } from '../models/project.entity';
import { User } from '../models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectUser, Project, User])],
  providers: [ProjectUserService],
  controllers: [ProjectUserController],
  exports: [ProjectUserService],
})
export class ProjectUserModule {}