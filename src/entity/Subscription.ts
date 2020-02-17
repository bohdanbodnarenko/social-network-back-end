import { BaseEntity, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { User } from './User';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Subscription:
 *        type: object
 *        required:
 *          - subscriber
 *          - subscribedTo
 *        properties:
 *          subscriber:
 *              type: object
 *              $ref: '#/components/schemas/User'
 *          subscribedTo:
 *              type: object
 *              $ref: '#/components/schemas/User'
 *          date:
 *            type: string
 *            format: 'date-time'
 */
@Entity()
export class Subscription extends BaseEntity {
    @ManyToOne(
        () => User,
        user => user.subscriptions,
        { primary: true },
    )
    subscriber: User;

    @ManyToOne(
        () => User,
        user => user.subscribers,
        { primary: true },
    )
    subscribedTo: User;

    @CreateDateColumn({ default: new Date() })
    date: Date;
}
