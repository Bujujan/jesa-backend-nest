import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Punch } from '../models/punch.entity';
import { CreatePunchDto } from './dto/create-punch.dto';
import { UpdatePunchDto } from './dto/update-punch.dto';
import { System } from '../models/system.entity';
import { User } from '../models/user.entity';
import { Project } from '../models/project.entity';

@Injectable()
export class PunchService {
  constructor(
    @InjectRepository(Punch)
    private punchRepository: Repository<Punch>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(System)
    private systemRepository: Repository<System>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Punch[]> {
    return this.punchRepository.find({ relations: ['created_by', 'modified_by', 'system', 'project'] });
  }

  async findByUser(userId: string): Promise<Punch[]> {
    return this.punchRepository.find({
      where: { created_by: { uuid: userId } },
      order: { created_at: 'DESC' }, // optional: latest first
      relations: ['project', 'created_by'],
    });
  }  

  async findOne(uuid: string): Promise<Punch> {
    const punch = await this.punchRepository.findOne({
      where: { uuid },
      relations: ['created_by', 'modified_by', 'system', 'project'],
    });
    if (!punch) {
      throw new NotFoundException(`Punch with UUID ${uuid} not found`);
    }
    return punch;
  }

  async create(createPunchDto: CreatePunchDto, userId: string): Promise<Punch> {
    const { system_id, project_id, image_url, title, description, status, category } = createPunchDto;

    // Verify user exists
    const user = await this.userRepository.findOne({ where: { uuid: userId } });
    if (!user) {
      throw new NotFoundException(`User with UUID ${userId} not found`);
    }

    // Verify system exists
    const system = await this.systemRepository.findOne({ where: { uuid: system_id } });
    if (!system) {
      throw new NotFoundException(`System with UUID ${system_id} not found`);
    }

    // Verify project exists
    const project = await this.projectRepository.findOne({ where: { uuid: project_id } });
    if (!project) {
      throw new NotFoundException(`Project with UUID ${project_id} not found`);
    }

    // Create punch with relations
    const punchInput = {
      title,
      description,
      status,
      category,
      image_url: image_url !== undefined ? image_url : null,
      system,
      project,
      created_by: user,
      modified_by: user,
    };

    const punch = this.punchRepository.create(punchInput as Punch);
    return this.punchRepository.save(punch);
  }

  async update(uuid: string, updatePunchDto: UpdatePunchDto, userId: string): Promise<Punch> {
    const punch = await this.findOne(uuid);

    // Verify user exists
    const user = await this.userRepository.findOne({ where: { uuid: userId } });
    if (!user) {
      throw new NotFoundException(`User with UUID ${userId} not found`);
    }

    // Handle system update
    if (updatePunchDto.system_id) {
      const system = await this.systemRepository.findOne({ where: { uuid: updatePunchDto.system_id } });
      if (!system) {
        throw new NotFoundException(`System with UUID ${updatePunchDto.system_id} not found`);
      }
      punch.system = system;
    }

    // Handle project update
    if (updatePunchDto.project_id) {
      const project = await this.projectRepository.findOne({ where: { uuid: updatePunchDto.project_id } });
      if (!project) {
        throw new NotFoundException(`Project with UUID ${updatePunchDto.project_id} not found`);
      }
      punch.project = project;
    }

    // Update fields if provided
    if (updatePunchDto.title) punch.title = updatePunchDto.title;
    if (updatePunchDto.description) punch.description = updatePunchDto.description;
    if (updatePunchDto.status) punch.status = updatePunchDto.status;
    if (updatePunchDto.category) punch.category = updatePunchDto.category;
    if (updatePunchDto.image_url !== undefined) punch.image_url = updatePunchDto.image_url;

    punch.modified_by = user;
    // Don't manually set updated_at - @UpdateDateColumn handles this automatically

    return this.punchRepository.save(punch);
  }

  async remove(uuid: string): Promise<void> {
    const punch = await this.findOne(uuid);
    await this.punchRepository.remove(punch);
  }
}