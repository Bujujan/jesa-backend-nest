import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SystemService } from './system.service';
import { CreateSystemDto } from './dto/create-system.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { System } from '../models/system.entity';// Adjust path as needed
import { AuthGuard } from '@nestjs/passport';

@Controller('systems')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  
  @Get()
  findAll(): Promise<System[]> {
    return this.systemService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<System> {
    return this.systemService.findOne(uuid);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('project/:projectUuid')
  findByProject(@Param('projectUuid') projectUuid: string): Promise<System[]> {
    return this.systemService.findByProject(projectUuid);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createSystemDto: CreateSystemDto): Promise<System> {
    return this.systemService.create(createSystemDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateSystemDto: UpdateSystemDto): Promise<System> {
    return this.systemService.update(uuid, updateSystemDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string): Promise<void> {
    return this.systemService.remove(uuid);
  }
}