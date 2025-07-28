import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['createdPunches', 'modifiedPunches', 'projectConnections'],
    });
  }

  async findById(uuid: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: ['createdPunches', 'modifiedPunches', 'projectConnections'],
    });
    if (!user) {
      throw new NotFoundException(`User with UUID ${uuid} not found`);
    }
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(uuid: string, userData: Partial<User>): Promise<User> {
    const user = await this.findById(uuid);
    Object.assign(user, userData);
    return this.userRepository.save(user);
  }

  async remove(uuid: string): Promise<void> {
    const user = await this.findById(uuid);
    await this.userRepository.remove(user);
  }
}