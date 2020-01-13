import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';
import { Like } from './Like';

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 30 })
    title: string;

    @Column({ type: 'text' })
    body: string;

    @CreateDateColumn()
    created: Date;

    @OneToMany(
        () => Comment,
        comment => comment.post,
    )
    comments: Comment[];

    @OneToMany(
        () => Like,
        like => like.post,
    )
    likes: Like[];

    @ManyToOne(
        () => User,
        user => user.posts,
    )
    owner: User;
}
