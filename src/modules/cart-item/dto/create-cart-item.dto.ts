import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCartItemDto {
    @IsNotEmpty()
    @IsNumber()
    cart_id: number;

    @IsNotEmpty()
    @IsNumber()
    dish_id: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}
