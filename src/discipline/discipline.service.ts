import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discipline } from '../models/discipline.entity';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';

@Injectable()
export class DisciplineService {
  constructor(
    @InjectRepository(Discipline)
    private disciplineRepository: Repository<Discipline>,
  ) {}

  async findAll(): Promise<Discipline[]> {
    return this.disciplineRepository.find({ relations: ['systems'] });
  }

  async findOne(uuid: string): Promise<Discipline> {
    const discipline = await this.disciplineRepository.findOne({
      where: { uuid },
      relations: ['systems'],
    });
    if (!discipline) {
      throw new NotFoundException(`Discipline with UUID ${uuid} not found`);
    }
    return discipline;
  }

  async create(createDisciplineDto: CreateDisciplineDto): Promise<Discipline> {
    const discipline = this.disciplineRepository.create(createDisciplineDto);
    return this.disciplineRepository.save(discipline);
  }

  async update(uuid: string, updateDisciplineDto: UpdateDisciplineDto): Promise<Discipline> {
    const discipline = await this.findOne(uuid);
    Object.assign(discipline, updateDisciplineDto);
    return this.disciplineRepository.save(discipline);
  }

  async remove(uuid: string): Promise<void> {
    const discipline = await this.findOne(uuid);
    await this.disciplineRepository.remove(discipline);
  }
}