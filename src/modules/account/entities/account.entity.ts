import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('account')
export class Account {
    @PrimaryGeneratedColumn()
    account_id: number;

    @Column({ length: 255, nullable: true })
    name: string;

    @Column({ length: 255, unique: true, nullable: false })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ type: 'enum', enum: ['Employee', 'Manager'] })
    role: string;

    @Column({ length: 50, nullable: true })
    phone: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ length: 500, nullable: true })
    refresh_token: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}