import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Dish {
    @PrimaryGeneratedColumn()
    dish_id: number;

    @Column({ type: 'varchar', length: 255 })
    dish_name: string;

    @Column()
    price: number;

    @Column('text', { nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    image_name: string;

    @Column({ type: 'enum', enum: ['Available', 'Unavailable'] })
    status: string;

    @Column('text', { nullable: true })
    options: string;

    @Column({ type: 'enum', enum: ['Chicken', 'Water'] })
    category: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
