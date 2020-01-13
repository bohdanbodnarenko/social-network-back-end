import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    BaseEntity,
    CreateDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { hash } from 'bcryptjs';
import { Channel } from './Channel';
import { Message } from './Message';
import { Post } from './Post';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    email: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    age: number;

    @Column({ type: 'text' })
    password: string;

    @CreateDateColumn()
    created: Date;

    @Column({ type: 'text' })
    about: string;

    @Column({ type: 'boolean', default: false })
    online: boolean;

    @Column({ type: 'timestamp' })
    last_active: Date;

    @OneToMany(
        () => Channel,
        channel => channel.owner,
    )
    own_channels: Channel[];

    @OneToMany(
        () => Message,
        message => message.sender,
    )
    messages: Message[];

    @OneToMany(
        () => Post,
        post => post.owner,
    )
    posts: Post[];

    @ManyToMany(
        () => Channel,
        channel => channel.participants,
    )
    @JoinTable({ name: 'user_channel' })
    channels: Channel[];

    @ManyToMany(
        () => User,
        user => user.following,
    )
    @JoinTable({ name: 'subscription' })
    followers: User[];

    @ManyToMany(
        () => User,
        user => user.followers,
    )
    following: User[];

    @BeforeInsert()
    async hashPasswordBeforeInsert() {
        this.password = await hash(this.password, 10);
    }
}
