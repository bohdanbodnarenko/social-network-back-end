import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    BaseEntity,
    CreateDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { hash } from 'bcryptjs';
import { Channel } from './Channel';
import { Message } from './Message';
import { Post } from './Post';
import { Subscription } from './Subscription';
import { Comment } from './Comment';
import { Category } from './Category';

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - email
 *          - password
 *          - firstName
 *          - lastName
 *        properties:
 *          id:
 *            type: integer
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          password:
 *              type: string
 *              format: password
 *          dateOfBirth:
 *              type: string
 *              format: date-time
 *          created:
 *              type: string
 *              format: date-time
 *          confirmed:
 *              type: boolean
 *              description: Did user confirm an email
 *          forgotPasswordLocked:
 *              type: boolean
 *              description: Is account locked for changing password
 *          imageUrl:
 *              type: string
 *              format: url
 *          about:
 *              type: string
 *          online:
 *              type: boolean
 *          lastActive:
 *              type: string
 *              format: date-time
 *          ownChannels:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Channel'
 *              description: 'List of channels where current user is owner'
 *          messages:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Message'
 *          posts:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Post'
 *          channels:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Channel'
 *              description: 'List of channels where current user is member'
 *          subscriptions:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Subscription'
 *          subscribers:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Subscription'
 *          comments:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Comment'
 *          categories:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Category'
 */
@Entity()
export class User extends BaseEntity {
    // TODO add location and google maps api
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: 'date', nullable: true })
    dateOfBirth: Date;

    @Column({ type: 'text', nullable: true })
    password: string;

    @CreateDateColumn({ default: new Date() })
    created: Date;

    @Column({ type: 'boolean', default: false })
    confirmed: boolean;

    @Column({ type: 'boolean', nullable: true, default: false })
    forgotPasswordLocked: boolean;

    @Column({ type: 'varchar', length: 200, nullable: true })
    imageUrl: string;

    @Column({ type: 'text', nullable: true })
    about: string;

    @Column({ type: 'boolean', default: false })
    online: boolean;

    @CreateDateColumn({ default: new Date() })
    lastActive: Date;

    @OneToMany(
        () => Channel,
        channel => channel.owner,
        { nullable: true },
    )
    ownChannels: Channel[];

    @OneToMany(
        () => Message,
        message => message.sender,
        { nullable: true },
    )
    messages: Message[];

    @OneToMany(
        () => Post,
        post => post.owner,
        { nullable: true },
    )
    posts: Post[];

    @ManyToMany(
        () => Channel,
        channel => channel.members,
        { nullable: true },
    )
    @JoinTable({ name: 'user_channel' })
    channels: Channel[];

    @OneToMany(
        () => Subscription,
        subscription => subscription.subscriber,
    )
    subscriptions: Subscription[];

    @OneToMany(
        () => Subscription,
        subscription => subscription.subscribedTo,
    )
    subscribers: Subscription[];

    @OneToMany(
        () => Comment,
        comment => comment.sender,
    )
    comments: Comment[];

    @ManyToMany(() => Category)
    categories: Category[];

    @BeforeInsert()
    async hashPasswordBeforeInsert(): Promise<void> {
        if (this.password) {
            this.password = await hash(this.password, 10);
        }
    }
}
