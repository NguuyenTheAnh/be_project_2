import { CartItem } from "@/modules/cart-item/entities/cart-item.entity";
import { Guest } from "@/modules/guest/entities/guest.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    cart_id: number;

    @Column({ default: 0 })
    total_cart: number;

    @OneToOne(() => Guest, guest => guest.cart)
    guest: Guest;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    cartItems: CartItem[];

}