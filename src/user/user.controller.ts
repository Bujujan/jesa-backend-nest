import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../models/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {  
    return this.userService.findAll();
  }

  @Get(':uuid')
  async findById(@Param('uuid') uuid: string): Promise<User> {
    return this.userService.findById(uuid);
  }

  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.create(userData);
  }

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() userData: Partial<User>): Promise<User> {
    return this.userService.update(uuid, userData);
  }

  @Patch(':uuid')
async updateUser(
  @Param('uuid') uuid: string,
  @Body() updateUserDto: UpdateUserDto
) {
  return this.userService.update(uuid, updateUserDto);
}

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string): Promise<void> {
    return this.userService.remove(uuid);
  }
}