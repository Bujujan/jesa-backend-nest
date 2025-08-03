import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { PunchStatus, PunchCategory } from '../../models/punch.entity';

export class CreatePunchDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(PunchStatus)
  @IsNotEmpty()
  status: PunchStatus;

  @IsEnum(PunchCategory)
  @IsNotEmpty()
  category: PunchCategory;

  @IsString()
  @IsNotEmpty()
  system_id: string;

  @IsString()
  @IsNotEmpty()
  project_id: string;

  @IsString()
  @IsOptional()
  image_url?: string;
}