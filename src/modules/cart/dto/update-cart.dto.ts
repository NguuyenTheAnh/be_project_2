import { IsInt } from "class-validator";

export class UpdateCartDto {
    @IsInt()
    total_cart: number;
}
