import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUser } from '../models/projectuser.entity';
import { CreateProjectUserDto } from './dto/create-projectuser.dto';
import { UpdateProjectUserDto } from './dto/update-projectuser.dto';
import { Project } from '../models/project.entity';
import { User } from '../models/user.entity';

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private projectUserRepository: Repository<ProjectUser>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<ProjectUser[]> {
    return this.projectUserRepository.find({ relations: ['user', 'project'] });
  }

  async findOne(uuid: string): Promise<ProjectUser> {
    const projectUser = await this.projectUserRepository.findOne({
      where: { uuid },
      relations: ['user', 'project'],
    });
    if (!projectUser) {
      throw new NotFoundException(`ProjectUser with UUID ${uuid} not found`);
    }
    return projectUser;
  }

  async create(createProjectUserDto: CreateProjectUserDto): Promise<ProjectUser> {
    const { user_id, project_id } = createProjectUserDto;

    const user = await this.userRepository.findOne({ where: { uuid: user_id } });
    if (!user) {
      throw new NotFoundException(`User with UUID ${user_id} not found`);
    }

    const project = await this.projectRepository.findOne({ where: { uuid: project_id } });
    if (!project) {
      throw new NotFoundException(`Project with UUID ${project_id} not found`);
    }

    const projectUser = this.projectUserRepository.create({
      user,
      project,
      assigned_at: new Date(),
    });

    return this.projectUserRepository.save(projectUser);
  }

  async update(uuid: string, updateProjectUserDto: UpdateProjectUserDto): Promise<ProjectUser> {
    const projectUser = await this.findOne(uuid);

    if (updateProjectUserDto.user_id) {
      const user = await this.userRepository.findOne({ where: { uuid: updateProjectUserDto.user_id } });
      if (!user) {
        throw new NotFoundException(`User with UUID ${updateProjectUserDto.user_id} not found`);
      }
      projectUser.user = user;
    }

    if (updateProjectUserDto.project_id) {
      const project = await this.projectRepository.findOne({ where: { uuid: updateProjectUserDto.project_id } });
      if (!project) {
        throw new NotFoundException(`Project with UUID ${updateProjectUserDto.project_id} not found`);
      }
      projectUser.project = project;
    }

    if (updateProjectUserDto.assigned_at) {
      projectUser.assigned_at = new Date(updateProjectUserDto.assigned_at);
    }

    return this.projectUserRepository.save(projectUser);
  }

  async remove(uuid: string): Promise<void> {
    const projectUser = await this.findOne(uuid);
    await this.projectUserRepository.remove(projectUser);
  }
}