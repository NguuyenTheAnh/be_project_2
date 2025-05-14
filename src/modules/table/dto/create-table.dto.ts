import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTableDto {

    @IsNotEmpty()
    @IsString()
    table_name: string;

    @IsNotEmpty()
    @IsEnum(['Paid', 'Unpaid'])
    payment_status: string;

    @IsNotEmpty()
    @IsInt()
    capacity: number;

    @IsNotEmpty()
    @IsEnum(['Available', 'Unavailable'])
    status: string;


}
