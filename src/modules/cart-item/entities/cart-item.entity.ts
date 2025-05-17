// src/cart-item/entities/cart-item.entity.ts
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Generated } from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { Dish } from '../../dish/entities/dish.entity';

@Entity('cart_item')
export class CartItem {
    @PrimaryColumn()
    cart_id: number;

    @PrimaryColumn()
    dish_id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.cartItems)
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @ManyToOne(() => Dish, (dish) => dish.cartItems)
    @JoinColumn({ name: 'dish_id' })
    dish: Dish;
}