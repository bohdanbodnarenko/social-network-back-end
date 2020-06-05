import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';
import { Like } from './Like';
import { Category } from './Category';

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
 *            type: integer
 *          title:
 *            type: string
 *          body:
 *            type: string
 *            description: The content of the post.
 *          created:
 *              type: string
 *              format: date-time
 *          updated:
 *              type: string
 *              format: date-time
 *          imageUrl:
 *              type: string
 *              format: url
 *          owner:
 *              type: object
 *              $ref: '#/components/schemas/User'
 *          comments:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Comment'
 *          likes:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Like'
 *          categories:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Category'
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

    @Column({ type: 'date', nullable: true })
    updated: Date;

    @Column({ type: 'varchar', length: 200, nullable: true })
    imageUrl: string;

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

    @ManyToMany(() => Category)
    categories: Category[];

    @ManyToOne(
        () => User,
        user => user.posts,
    )
    owner: User;
}
