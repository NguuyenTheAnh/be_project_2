import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Guest } from '../../guest/entities/guest.entity';
import { Table } from '../../table/entities/table.entity';
import { Account } from '../../account/entities/account.entity';

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn()
    order_id: number;

    @Column({ type: 'text', nullable: true })
    options: string;

    @Column({ type: 'enum', enum: ['Pending', 'Completed'] })
    status: string;

    @Column()
    total_order: number;

    @Column()
    guest_id: number;

    @Column({ nullable: true })
    table_id: number;

    @Column({ nullable: true })
    order_handler_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Guest, (guest) => guest.orders, { eager: false })
    @JoinColumn({ name: 'guest_id' })
    guest: Guest;

    @ManyToOne(() => Table, (table) => table.orders, { eager: false })
    @JoinColumn({ name: 'table_id' })
    table: Table;

    @ManyToOne(() => Account, (account) => account.orders, { eager: false })
    @JoinColumn({ name: 'order_handler_id' })
    orderHandler: Account;
}