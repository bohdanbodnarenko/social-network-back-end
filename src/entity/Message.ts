import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Channel } from './Channel';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Message:
 *        type: object
 *        required:
 *          - content
 *        properties:
 *          id:
 *            type: integer
 *          content:
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
 *          sender:
 *              type: object
 *              $ref: '#/components/schemas/ShortUser'
 *          channel:
 *              type: object
 *              $ref: '#/components/schemas/Channel'
 */
@Entity()
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn({ default: new Date() })
    created: Date;

    @Column({ type: 'varchar', length: 200, nullable: true })
    imageUrl: string;

    @ManyToOne(
        () => User,
        user => user.messages,
    )
    sender: User;

    @Column({ type: 'date', nullable: true })
    updated: Date;

    @ManyToOne(
        () => Channel,
        channel => channel.messages,
    )
    channel: Channel;
}
