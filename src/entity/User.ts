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
    firstName: string;

    @Column()
    lastName: string;

    @CreateDateColumn({ nullable: true })
    dateOfBirth: Date;

    @Column({ type: 'text' })
    password: string;

    @CreateDateColumn()
    created: Date;

    @Column({ type: 'boolean', default: false })
    confirmed: boolean;

    @Column({ type: 'boolean', nullable: true })
    forgotPasswordLocked: boolean;

    @Column({ type: 'text', nullable: true })
    about: string;

    @Column({ type: 'boolean', default: false })
    online: boolean;

    @CreateDateColumn()
    lastActive: Date;

    @OneToMany(
        () => Channel,
        channel => channel.owner,
        { nullable: true },
    )
    ownChannels: Channel[];

    @OneToMany(
        () => Message,
        message => message.sender,
        { nullable: true },
    )
    messages: Message[];

    @OneToMany(
        () => Post,
        post => post.owner,
        { nullable: true },
    )
    posts: Post[];

    @ManyToMany(
        () => Channel,
        channel => channel.participants,
        { nullable: true },
    )
    @JoinTable({ name: 'user_channel' })
    channels: Channel[];

    @ManyToMany(
        () => User,
        user => user.following,
        { nullable: true },
    )
    @JoinTable({ name: 'subscription' })
    followers: User[];

    @ManyToMany(
        () => User,
        user => user.followers,
    )
    following: User[];

    @BeforeInsert()
    async hashPasswordBeforeInsert(): Promise<void> {
        this.password = await hash(this.password, 10);
    }
}
