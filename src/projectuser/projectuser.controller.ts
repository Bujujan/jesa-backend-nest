import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProjectUserService } from './projectuser.service';
import { CreateProjectUserDto } from './dto/create-projectuser.dto';
import { UpdateProjectUserDto } from './dto/update-projectuser.dto';
import { ProjectUser } from '../models/projectuser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('projectuser')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService, @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,) {}

  @Get()
  findAll(): Promise<ProjectUser[]> {
    return this.projectUserService.findAll();
  }

  @Get(':userId')
  async getUserProjects(@Param('userId') userId: string) {
    try {
      // Find all ProjectUser records for this user and include the project data
      const projectUsers = await this.projectUserRepository.find({
        where: { user: { uuid: userId } },
        relations: ['project'], // This will include the project data
      });

      // Extract just the projects
      const projects = projectUsers.map(pu => pu.project);

      return {
        success: true,
        projects: projects,
        count: projects.length
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch user projects',
        error: error.message
      };
    }
  }

  @Post()
  create(@Body() createProjectUserDto: CreateProjectUserDto): Promise<ProjectUser> {
    return this.projectUserService.create(createProjectUserDto);
  }

  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateProjectUserDto: UpdateProjectUserDto): Promise<ProjectUser> {
    return this.projectUserService.update(uuid, updateProjectUserDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string): Promise<void> {
    return this.projectUserService.remove(uuid);
  }
}