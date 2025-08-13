// update-user.dto.ts
import { IsOptional, IsString, IsEmail, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(['Commissioning', 'Completion'])
  role?: 'Commissioning' | 'Completion';
}
