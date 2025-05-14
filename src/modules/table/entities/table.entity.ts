import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
