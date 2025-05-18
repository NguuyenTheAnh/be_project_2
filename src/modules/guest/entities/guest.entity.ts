import { Cart } from '@/modules/cart/entities/cart.entity';
import { Order } from '@/modules/order/entities/order.entity';
import { Table } from '@/modules/table/entities/table.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('guest')
export class Guest {
    @PrimaryGeneratedColumn()
    guest_id: number;

    @Column()
    guest_name: string;

    @Column({ nullable: true })
    refresh_token: string;

    // Table: Many guests can belong to one table
    @ManyToOne(() => Table, table => table.guests, { eager: false })
    @JoinColumn({ name: 'table_id' })
    table: Table;

    @Column()
    table_id: number;

    // Cart: One guest has one cart
    @OneToOne(() => Cart, { eager: false })
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @Column()
    cart_id: number; // Optional: similar to table_id

    @OneToMany(() => Order, (order) => order.guest)
    orders: Order[];
}
