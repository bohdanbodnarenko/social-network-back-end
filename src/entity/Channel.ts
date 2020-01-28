import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Message } from './Message';

@Entity()
export class Channel extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    tag: string;

    @Column({ type: 'boolean', default: true })
    isPrivate: boolean;

    @ManyToOne(
        () => User,
        user => user.ownChannels,
    )
    owner: User;

    @ManyToMany(
        () => User,
        user => user.channels,
    )
    members: User[];

    @OneToMany(
        () => Message,
        message => message.channel,
    )
    messages: Message[];
}
