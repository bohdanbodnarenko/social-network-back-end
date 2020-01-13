import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(
        () => Post,
        post => post.comments,
    )
    post: Post;

    @OneToOne(() => User)
    @JoinColumn()
    sender: User;
}
