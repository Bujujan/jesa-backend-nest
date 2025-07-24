import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { Discipline } from '../models/discipline.entity';

@Controller('disciplines')
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Get()
  findAll(): Promise<Discipline[]> {
    return this.disciplineService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<Discipline> {
    return this.disciplineService.findOne(uuid);
  }

  @Post()
  create(@Body() createDisciplineDto: CreateDisciplineDto): Promise<Discipline> {
    return this.disciplineService.create(createDisciplineDto);
  }

  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateDisciplineDto: UpdateDisciplineDto): Promise<Discipline> {
    return this.disciplineService.update(uuid, updateDisciplineDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string): Promise<void> {
    return this.disciplineService.remove(uuid);
  }
}