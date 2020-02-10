import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './Post';
import { User } from './User';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Comment:
 *        type: object
 *        required:
 *          - content
 *        properties:
 *          id:
 *            type: int
 *          content:
 *            type: string
 *            description: The content of the comment.
 *          created:
 *              type: string
 *              format: date-time
 *          post:
 *              type: object
 *              $ref: '#/components/schemas/Post'
 *          sender:
 *              type: object
 *              $ref: '#/components/schemas/User'
 */
@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn({ default: new Date() })
    created: Date;

    @ManyToOne(
        () => Post,
        post => post.comments,
    )
    post: Post;

    @OneToOne(() => User)
    @JoinColumn()
    sender: User;
}
