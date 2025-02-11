import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email?: string;

  @IsString()
  username?: string;

  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  experienceYears?: number;

  @IsNotEmpty()
  password: string;
}
