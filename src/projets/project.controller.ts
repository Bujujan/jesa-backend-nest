import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from '../models/project.entity';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string): Promise<Project> {
    return this.projectService.findOne(uuid);
  }

  @Post()
  create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectService.create(createProjectDto);
  }

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() updateProjectDto: UpdateProjectDto): Promise<Project> {
    return this.projectService.update(uuid, updateProjectDto);
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string): Promise<void> {
    return this.projectService.remove(uuid);
  }
}