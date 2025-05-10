import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

    @Column({ length: 255, nullable: true })
    avatar: string;

    @Column({ default: false })
    is_active: boolean;

    @Column({ length: 500, nullable: true })
    refresh_token: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}