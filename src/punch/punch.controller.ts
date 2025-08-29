import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { PunchService } from './punch.service';
import { CreatePunchDto } from './dto/create-punch.dto';
import { UpdatePunchDto } from './dto/update-punch.dto';
import { Punch } from '../models/punch.entity';
import { ClerkRequest } from '../types/request.interface';
import { UnauthorizedException } from '@nestjs/common';

@Controller('punches')
@UseGuards(ClerkAuthGuard)
export class PunchController {
  constructor(private readonly punchService: PunchService) {}

  @Get()
  findAll(): Promise<Punch[]> {
    return this.punchService.findAll();
  }

  @Get('me')
findMyPunches(@Req() request: ClerkRequest): Promise<Punch[]> {
  const userId = request.user?.id;
  if (!userId) {
    throw new UnauthorizedException('User not authenticated');
  }
  return this.punchService.findByUser(userId);
}

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<Punch> {
    return this.punchService.findOne(uuid);
  }

  @Post()
  create(@Body() createPunchDto: CreatePunchDto, @Req() request: ClerkRequest): Promise<Punch> {
    const userId = request.user.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.punchService.create(createPunchDto, userId);
  }

  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() updatePunchDto: UpdatePunchDto, @Req() request: ClerkRequest): Promise<Punch> {
    const userId = request.user.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.punchService.update(uuid, updatePunchDto, userId);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string): Promise<void> {
    return this.punchService.remove(uuid);
  }
}