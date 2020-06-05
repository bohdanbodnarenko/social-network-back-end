import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './Channel';
import { Post } from './Post';
import { User } from './User';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Category:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *            description: The content of the post.
 *          posts:
 *            type: array
 *            items:
 *              type: object
 *              $ref: '#/components/schemas/Post'
 *          users:
 *            type: array
 *            items:
 *              type: object
 *              $ref: '#/components/schemas/User'
 *          channels:
 *            type: array
 *            items:
 *              type: object
 *              $ref: '#/components/schemas/Channel'
 */
@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ManyToMany(() => Post)
    @JoinTable()
    posts: Post[];

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];

    @ManyToMany(() => Channel)
    @JoinTable()
    channels: Channel[];
}
