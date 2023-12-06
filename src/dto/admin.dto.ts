import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @MinLength(10)
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsArray()
  @IsNotEmpty()
  readonly role: string;

  @IsOptional()
  @IsString()
  readonly status?: string;
}
