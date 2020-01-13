import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Channel extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToOne(
        () => User,
        user => user.own_channels,
    )
    owner: User;

    @ManyToMany(
        () => User,
        user => user.channels,
    )
    participants: User[];
}
