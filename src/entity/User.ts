import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BaseEntity, Timestamp } from 'typeorm';
import { hash } from 'bcryptjs';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'text' })
    about: string;

    @Column({ type: 'boolean', default: false })
    online: boolean;

    @Column({ type: 'timestamp' })
    lastActive: Date;

    @BeforeInsert()
    async hashPasswordBeforeInsert() {
        this.password = await hash(this.password, 10);
    }
}
