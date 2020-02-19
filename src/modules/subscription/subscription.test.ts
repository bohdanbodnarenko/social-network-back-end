import * as requests from 'supertest';
import { Response } from 'supertest';
import axios from 'axios';

import { createTypeormConn } from '../../utils/createTypeormConn';
import { app } from '../../app';
import { User } from '../../entity';

export let request: requests.SuperTest<any>, token: string, userId: number, userId1: number;

const email = 'testSubscription@test.com',
    password = 'testChannel',
    email1 = 'testSubscription2@test.com',
    password1 = 'testChannel2',
    firstName = 'firstName',
    lastName = 'lastName';

beforeAll(async () => {
    await createTypeormConn();
    request = requests(app);
    const user = User.create({ email, password, firstName, lastName, confirmed: true });
    await user.save();

    const user1 = User.create({
        email: email1,
        password: password1,
        firstName: 'firstName',
        lastName: 'lastName',
        confirmed: true,
    });
    await user1.save();

    userId = user.id;
    userId1 = user1.id;

    const { data } = await axios.post(process.env.API_BASE + '/login', { email, password });
    token = data.token;
});

describe('Subscription routes', () => {
    it('should subscribe to user', async done => {
        request
            .post(`/subscribe/${userId1}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, { message: 'Ok' }, done);
    });
    it('should fail already subscribed', async done => {
        request
            .post(`/subscribe/${userId1}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(403, { error: 'You are already followed to this user' }, done);
    });
    it('should fail to subscribe yourself', async done => {
        request
            .post(`/subscribe/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400, { error: "You can't follow yourself" }, done);
    });
    it('should return count of followers', done => {
        request
            .get(`/followers/${userId1}/count`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, { count: 1 }, done);
    });
    it('should return followers', done => {
        request
            .get(`/followers/${userId1}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res: Response) => {
                if (err) done(err);
                const { body } = res,
                    [user] = body;
                expect(user.id).toBe(userId);
                expect(user.email).toBe(email);
                done();
            });
    });
    it('should return count of following', done => {
        request
            .get(`/following/${userId}/count`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, { count: 1 }, done);
    });
    it('should return following users', done => {
        request
            .get(`/following/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res: Response) => {
                if (err) done(err);
                const { body } = res,
                    [user] = body;
                expect(user.id).toBe(userId1);
                expect(user.email).toBe(email1);
                done();
            });
    });
    it('should unsubscribe from user', async done => {
        request
            .post(`/unsubscribe/${userId1}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, { message: 'Ok' }, done);
    });
    it('should fail already unsubscribed', async done => {
        request
            .post(`/unsubscribe/${userId1}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(403, { error: 'You are not followed to this user' }, done);
    });
    it('should fail to unsubscribe yourself', async done => {
        request
            .post(`/unsubscribe/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400, { error: "You can't un follow yourself" }, done);
    });
});
