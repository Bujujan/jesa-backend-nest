import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PunchService } from './punch.service';
import { CreatePunchDto } from './dto/create-punch.dto';
import { UpdatePunchDto } from './dto/update-punch.dto';
import { Punch } from '../models/punch.entity';
import { Request } from 'express';
import { NotFoundException } from '@nestjs/common';

@Controller('punches')
// @UseGuards(AuthGuard('jwt'))
export class PunchController {
  constructor(private readonly punchService: PunchService) {}

  @Get()
  findAll(): Promise<Punch[]> {
    return this.punchService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<Punch> {
    return this.punchService.findOne(uuid);
  }

  @Post()
  create(@Body() createPunchDto: CreatePunchDto, @Req() request: Request): Promise<Punch> {
    const userId = request.user?.uuid;
    if (!userId) {
      throw new NotFoundException('User not authenticated');
    }
    return this.punchService.create(createPunchDto, userId);
  }

  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() updatePunchDto: UpdatePunchDto, @Req() request: Request): Promise<Punch> {
    const userId = request.user?.uuid;
    if (!userId) {
      throw new NotFoundException('User not authenticated');
    }
    return this.punchService.update(uuid, updatePunchDto, userId);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string): Promise<void> {
    return this.punchService.remove(uuid);
  }
}