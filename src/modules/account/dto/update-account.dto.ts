import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateAccountDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    password?: string;
}