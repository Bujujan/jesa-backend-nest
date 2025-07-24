import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SystemService } from './system.service';
import { CreateSystemDto } from './dto/create-system.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { System } from '../models/system.entity';

@Controller('systems')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get()
  findAll(): Promise<System[]> {
    return this.systemService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<System> {
    return this.systemService.findOne(uuid);
  }

  @Post()
  create(@Body() createSystemDto: CreateSystemDto): Promise<System> {
    return this.systemService.create(createSystemDto);
  }

  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateSystemDto: UpdateSystemDto): Promise<System> {
    return this.systemService.update(uuid, updateSystemDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string): Promise<void> {
    return this.systemService.remove(uuid);
  }
}