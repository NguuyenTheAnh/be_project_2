import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class CreateAccountDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(['Employee', 'Manager'])
    role: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}