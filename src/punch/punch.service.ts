import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Punch } from '../models/punch.entity';
import { CreatePunchDto } from './dto/create-punch.dto';
import { UpdatePunchDto } from './dto/update-punch.dto';
import { User } from '../models/user.entity';
import { System } from '../models/system.entity';

@Injectable()
export class PunchService {
  constructor(
    @InjectRepository(Punch)
    private punchRepository: Repository<Punch>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(System)
    private systemRepository: Repository<System>,
  ) {}

  async findAll(): Promise<Punch[]> {
    return this.punchRepository.find({ relations: ['created_by', 'modified_by', 'system'] });
  }

  async findOne(uuid: string): Promise<Punch> {
    const punch = await this.punchRepository.findOne({
      where: { uuid },
      relations: ['created_by', 'modified_by', 'system'],
    });
    if (!punch) {
      throw new NotFoundException(`Punch with UUID ${uuid} not found`);
    }
    return punch;
  }

  async create(createPunchDto: CreatePunchDto, userId: string): Promise<Punch> {
    const { system_id, ...punchData } = createPunchDto;

    const user = await this.userRepository.findOne({ where: { uuid: userId } });
    if (!user) {
      throw new NotFoundException(`User with UUID ${userId} not found`);
    }

    let system: DeepPartial<System> | undefined = undefined;
    if (system_id) {
      const foundSystem = await this.systemRepository.findOne({ where: { uuid: system_id } });
      if (!foundSystem) {
        throw new NotFoundException(`System with UUID ${system_id} not found`);
      }
      system = { uuid: system_id };
    }

    const punchInput: DeepPartial<Punch> = {
      ...punchData,
      created_by: { uuid: userId },
      modified_by: { uuid: userId },
      system,
    };

    const punch = this.punchRepository.create(punchInput);
    return this.punchRepository.save(punch);
  }

  async update(uuid: string, updatePunchDto: UpdatePunchDto, userId: string): Promise<Punch> {
    const punch = await this.findOne(uuid);

    const user = await this.userRepository.findOne({ where: { uuid: userId } });
    if (!user) {
      throw new NotFoundException(`User with UUID ${userId} not found`);
    }

    let system: DeepPartial<System> | undefined = punch.system ? { uuid: punch.system.uuid } : undefined;
    if (updatePunchDto.system_id) {
      const foundSystem = await this.systemRepository.findOne({ where: { uuid: updatePunchDto.system_id } });
      if (!foundSystem) {
        throw new NotFoundException(`System with UUID ${updatePunchDto.system_id} not found`);
      }
      system = { uuid: updatePunchDto.system_id };
    } else if (updatePunchDto.system_id === null) {
      system = undefined;
    }

    Object.assign(punch, {
      title: updatePunchDto.title ?? punch.title,
      description: updatePunchDto.description ?? punch.description,
      status: updatePunchDto.status ?? punch.status,
      modified_by: { uuid: userId },
      system,
    });

    return this.punchRepository.save(punch);
  }

  async remove(uuid: string): Promise<void> {
    const punch = await this.findOne(uuid);
    await this.punchRepository.remove(punch);
  }
}