import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn()
    created: Date;

    @ManyToOne(
        () => User,
        user => user.messages,
    )
    sender: User;

    //TODO add media content to store in db, separated table to use for user and post as well
}
