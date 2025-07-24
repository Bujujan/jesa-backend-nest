import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProjectUserService } from './projectuser.service';
import { CreateProjectUserDto } from './dto/create-projectuser.dto';
import { UpdateProjectUserDto } from './dto/update-projectuser.dto';
import { ProjectUser } from '../models/projectuser.entity';

@Controller('projectuser')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}

  @Get()
  findAll(): Promise<ProjectUser[]> {
    return this.projectUserService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<ProjectUser> {
    return this.projectUserService.findOne(uuid);
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