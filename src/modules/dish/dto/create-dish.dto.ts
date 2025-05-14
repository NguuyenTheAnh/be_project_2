import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDishDto {
    @IsNotEmpty()
    @IsString()
    dish_name: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    image_name: string;

    @IsNotEmpty()
    @IsEnum(['Available', 'Unavailable'])
    status: string;

    @IsNotEmpty()
    @IsEnum(['Chicken', 'Water'])
    category: string;

    @IsOptional()
    @IsString()
    options?: string;
}
