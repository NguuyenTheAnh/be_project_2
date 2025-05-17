import { Guest } from "@/modules/guest/entities/guest.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    cart_id: number;

    @Column({ default: 0 })
    total_cart: number;

    @OneToOne(() => Guest, guest => guest.cart)
    guest: Guest;

}