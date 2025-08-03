import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PunchStatus, PunchCategory } from '../../models/punch.entity';

export class UpdatePunchDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PunchStatus)
  @IsOptional()
  status?: PunchStatus;

  @IsEnum(PunchCategory)
  @IsOptional()
  category?: PunchCategory;

  @IsString()
  @IsOptional()
  system_id?: string;

  @IsString()
  @IsOptional()
  project_id?: string;

  @IsString()
  @IsOptional()
  image_url?: string;
}