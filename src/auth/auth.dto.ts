import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsNumber()
  age: number;

  @IsOptional()
  @IsNumber()
  experienceYears?: number;

  @IsNotEmpty()
  password: string;
}

export class VerifyEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  code: string;
}

export class RefreshDto {
  @IsNumber()
  userId: number;

  @IsString()
  refreshToken: string;
}
