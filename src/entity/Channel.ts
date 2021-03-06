import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Message } from './Message';
import { Category } from './Category';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Channel:
 *        type: object
 *        required:
 *          - content
 *        properties:
 *          id:
 *            type: string
 *          name:
 *            type: string
 *          tag:
 *            type: string
 *            description: The unique tag of the channel.
 *          isPrivate:
 *              type: boolean
 *          imageUrl:
 *              type: string
 *              format: url
 *          owner:
 *              type: object
 *              $ref: '#/components/schemas/User'
 *          members:
 *              type: array
 *              items:
 *                  type: object
 *                  $ref: '#/components/schemas/User'
 *          messages:
 *              type: array
 *              items:
 *                  type: object
 *                  $ref: '#/components/schemas/Message'
 *          categories:
 *              type: array
 *              items:
 *                  type: object
 *                  $ref: '#/components/schemas/Category'
 */
@Entity()
export class Channel extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    tag: string;

    @Column({ type: 'boolean', default: true })
    isPrivate: boolean;

    @Column({ type: 'varchar', length: 200, nullable: true })
    imageUrl: string;

    @ManyToOne(
        () => User,
        user => user.ownChannels,
    )
    owner: User;

    @ManyToMany(
        () => User,
        user => user.channels,
    )
    members: User[];

    @OneToMany(
        () => Message,
        message => message.channel,
    )
    messages: Message[];

    @ManyToMany(() => Category)
    categories: Category[];
}
