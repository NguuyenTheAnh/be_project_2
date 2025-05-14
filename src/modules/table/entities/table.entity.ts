import { Guest } from '@/modules/guest/entities/guest.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('table')
export class Table {
    @PrimaryGeneratedColumn()
    table_id: number;

    @Column({ unique: true })
    table_name: string;

    @Column({
        type: 'enum',
        enum: ['Paid', 'Unpaid'],
    })
    payment_status: string;

    @Column()
    capacity: number;

    @Column({
        type: 'enum',
        enum: ['Available', 'Unavailable'],
    })
    status: string;

    @OneToMany(() => Guest, guest => guest.table)
    guests: Guest[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
