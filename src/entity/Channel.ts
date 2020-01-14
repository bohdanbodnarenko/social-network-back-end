import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Message } from './Message';

@Entity()
export class Channel extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToOne(
        () => User,
        user => user.ownChannels,
    )
    owner: User;

    @ManyToMany(
        () => User,
        user => user.channels,
    )
    participants: User[];

    @OneToMany(
        () => Message,
        message => message.channel,
    )
    messages: Message[];
}
