import { Column, Entity, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Table } from '../../table/entities/table.entity';

@Entity('transaction')
export class Transaction {
    @PrimaryColumn({ type: 'varchar', length: 100 })
    transaction_id: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    id_zalopay: string;

    @Column({ type: 'bigint' })
    transaction_date: number;

    @Column({ type: 'bigint' })
    amount_in: number;

    @Column({ type: 'bigint' })
    amount_out: number;

    @Column({ type: 'bigint' })
    accumulated: number;

    @Column({ type: 'int' })
    table_id: number;

    @ManyToOne(() => Table, (table) => table.transactions)
    @JoinColumn({ name: 'table_id' })
    table: Table;

    @CreateDateColumn()
    created_at: Date;
}