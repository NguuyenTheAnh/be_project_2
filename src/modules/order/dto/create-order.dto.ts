import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
    @IsOptional()
    @IsString()
    options?: string;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsNotEmpty()
    @IsInt()
    total_order: number;

    @IsNotEmpty()
    @IsInt()
    guest_id: number;

    @IsNotEmpty()
    @IsInt()
    table_id: number;

    @IsOptional()
    @IsInt()
    order_handler_id?: number;
}
