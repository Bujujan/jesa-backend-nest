import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../models/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['users'] });
  }

  async findOne(uuid: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ 
      where: { uuid },
      relations: ['users'],
    });
    if (!project) {
      throw new NotFoundException(`Project with UUID ${uuid} not found`);
    }
    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async update(uuid: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(uuid);
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(uuid: string): Promise<void> {
    const project = await this.findOne(uuid);
    await this.projectRepository.remove(project);
  }
}