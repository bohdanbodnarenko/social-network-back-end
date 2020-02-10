import { BaseEntity, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Like:
 *        type: object
 *        required:
 *          - post
 *          - user
 *        properties:
 *          post:
 *              type: object
 *              $ref: '#/components/schemas/Post'
 *          user:
 *              type: object
 *              $ref: '#/components/schemas/User'
 */
@Entity()
export class Like extends BaseEntity {
    @ManyToOne(
        () => Post,
        post => post.likes,
        { primary: true },
    )
    post: Post;

    @OneToOne(() => User, { primary: true })
    @JoinColumn()
    user: User;
}
