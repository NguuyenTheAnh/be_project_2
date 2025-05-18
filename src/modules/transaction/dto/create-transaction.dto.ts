import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    transaction_id: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    id_zalopay: string;

    @IsNotEmpty()
    @IsNumber()
    transaction_date: number;

    @IsNotEmpty()
    @IsNumber()
    amount_in: number;

    @IsNotEmpty()
    @IsNumber()
    amount_out: number;

    @IsNotEmpty()
    @IsNumber()
    accumulated: number;

    @IsNotEmpty()
    @IsInt()
    table_id: number;
}