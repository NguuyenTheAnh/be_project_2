import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGuestDto {
    @IsNotEmpty()
    @IsString()
    guest_name: string;

    @IsNotEmpty()
    @IsInt()
    table_id: number;

    @IsNotEmpty()
    @IsInt()
    cart_id: number;

}
