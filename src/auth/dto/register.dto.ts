import { IsEmail, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    avatar: string;
}