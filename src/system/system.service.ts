import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { System } from '../models/system.entity';
import { CreateSystemDto } from './dto/create-system.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { Discipline } from '../models/discipline.entity';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(System)
    private systemRepository: Repository<System>,
    @InjectRepository(Discipline)
    private disciplineRepository: Repository<Discipline>,
  ) {}

  async findAll(): Promise<System[]> {
    return this.systemRepository.find({ relations: ['discipline', 'punches'] });
  }

  async findOne(uuid: string): Promise<System> {
    const system = await this.systemRepository.findOne({
      where: { uuid },
      relations: ['discipline', 'punches'],
    });
    if (!system) {
      throw new NotFoundException(`System with UUID ${uuid} not found`);
    }
    return system;
  }

  async create(createSystemDto: CreateSystemDto): Promise<System> {
    const { discipline_id, ...systemData } = createSystemDto;

    const discipline = await this.disciplineRepository.findOne({ where: { uuid: discipline_id } });
    if (!discipline) {
      throw new NotFoundException(`Discipline with UUID ${discipline_id} not found`);
    }

    const system = this.systemRepository.create({
      ...systemData,
      discipline,
    });

    return this.systemRepository.save(system);
  }

  async update(uuid: string, updateSystemDto: UpdateSystemDto): Promise<System> {
    const system = await this.findOne(uuid);

    if (updateSystemDto.discipline_id) {
      const discipline = await this.disciplineRepository.findOne({ where: { uuid: updateSystemDto.discipline_id } });
      if (!discipline) {
        throw new NotFoundException(`Discipline with UUID ${updateSystemDto.discipline_id} not found`);
      }
      system.discipline = discipline;
    }

    Object.assign(system, {
      system_number: updateSystemDto.system_number ?? system.system_number,
      description: updateSystemDto.description ?? system.description,
      area: updateSystemDto.area ?? system.area,
      system_type: updateSystemDto.system_type ?? system.system_type,
      contractors: updateSystemDto.contractors ?? system.contractors,
    });

    return this.systemRepository.save(system);
  }

  async remove(uuid: string): Promise<void> {
    const system = await this.findOne(uuid);
    await this.systemRepository.remove(system);
  }
}