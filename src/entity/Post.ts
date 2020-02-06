import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';
import { Like } from './Like';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Post:
 *        type: object
 *        required:
 *          - title
 *          - body
 *        properties:
 *          id:
 *            type: int
 *          title:
 *            type: string
 *          body:
 *            type: string
 *            description: The content of the post.
 *          created:
 *              type: string
 *              format: date-time
 */
@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 30 })
    title: string;

    @Column({ type: 'text' })
    body: string;

    @CreateDateColumn({ default: new Date() })
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
