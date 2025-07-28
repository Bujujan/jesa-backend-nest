import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUser } from '../models/projectuser.entity';
import { CreateProjectUserDto } from './dto/create-projectuser.dto';
import { UpdateProjectUserDto } from './dto/update-projectuser.dto';
import { Project } from '../models/project.entity';
import { User } from '../models/user.entity';

console.log('=== DEBUG: Checking imports ===');
console.log('ProjectUser:', ProjectUser);
console.log('Project:', Project);
console.log('User:', User);
console.log('Repository:', Repository);
console.log('=== END DEBUG ===');

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
    try {
      return await this.projectUserRepository.find({ relations: ['user', 'project'] });
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException('Failed to fetch project users');
    }
  }

  async findOne(uuid: string): Promise<ProjectUser> {
    try {
      const projectUser = await this.projectUserRepository.findOne({
        where: { uuid },
        relations: ['user', 'project'],
      });
      if (!projectUser) {
        throw new NotFoundException(`ProjectUser with UUID ${uuid} not found`);
      }
      return projectUser;
    } catch (error) {
      console.error(`Error fetching ProjectUser with UUID ${uuid}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch ProjectUser with UUID ${uuid}`);
    }
  }

  async create(createProjectUserDto: CreateProjectUserDto): Promise<ProjectUser> {
    try {
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

      return await this.projectUserRepository.save(projectUser);
    } catch (error) {
      console.error('Error in create:', error);
      throw new InternalServerErrorException('Failed to create ProjectUser');
    }
  }

  async update(uuid: string, updateProjectUserDto: UpdateProjectUserDto): Promise<ProjectUser> {
    try {
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

      return await this.projectUserRepository.save(projectUser);
    } catch (error) {
      console.error(`Error updating ProjectUser with UUID ${uuid}:`, error);
      throw new InternalServerErrorException(`Failed to update ProjectUser with UUID ${uuid}`);
    }
  }

  async remove(uuid: string): Promise<void> {
    try {
      const projectUser = await this.findOne(uuid);
      await this.projectUserRepository.remove(projectUser);
    } catch (error) {
      console.error(`Error removing ProjectUser with UUID ${uuid}:`, error);
      throw new InternalServerErrorException(`Failed to remove ProjectUser with UUID ${uuid}`);
    }
  }
}