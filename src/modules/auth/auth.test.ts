import * as faker from 'faker';
import axios from 'axios';
import { Response } from 'supertest';
import * as bcrypt from 'bcryptjs';

import { request } from '../../tests/setup';
import { redis } from '../../redis';
import { User } from '../../entity';
import { confirmEmailPrefix, forgotPasswordPrefix } from '../shared/constants/constants';

const email = faker.internet.email(),
    password = faker.internet.password(),
    firstName = faker.internet.userName(),
    lastName = faker.internet.userName(),
    dateOfBirth = new Date(),
    password2 = faker.internet.password();

let token = '';

describe('Auth routes', () => {
    it('should fail with bad email', done => {
        request
            .post(`/register`)
            .send({ email: '123', password, firstName, lastName, dateOfBirth })
            .set('Accept', 'application/json')
            .expect(400, [{ path: 'email', message: 'Email must be a valid email' }], done);
    });
    it('should register a new user', done => {
        request
            .post(`/register`)
            .send({ email, password, firstName, lastName, dateOfBirth })
            .set('Accept', 'application/json')
            .expect(200, { message: 'Registration success' }, done);
    });
    it('should fail with duplicate email', done => {
        request
            .post(`/register`)
            .send({ email, password, firstName, lastName, dateOfBirth })
            .set('Accept', 'application/json')
            .expect(403, [{ path: 'email', message: 'Email is taken already' }], done);
    });
    it('should fail login with not confirmed', done => {
        request
            .post(`/login`)
            .send({ email, password })
            .set('Accept', 'application/json')
            .expect(
                403,
                [
                    {
                        path: 'email',
                        message: 'Please confirm your email first',
                    },
                ],
                done,
            );
    });
    it('should confirm an email', async done => {
        const [userKey] = await redis.keys(confirmEmailPrefix + '*');
        const { data, status } = await axios.get(`${process.env.API_BASE}/confirm/${userKey}`);
        expect(status).toBe(200);
        expect(data).toEqual({ message: 'ok' });
        const user = await User.findOne(1);
        expect(user.confirmed).toBe(true);
        done();
    });
    it('should login a user', done => {
        request
            .post(`/login`)
            .send({ email, password })
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res: Response) => {
                if (err) return done(err);
                token = res.body.token;
                const { user } = res.body;
                expect(user.email).toEqual(email);
                expect(user.password).toBeUndefined();
                done();
            });
    });
    it('should fail with user does not exist', done => {
        request
            .post(`/login`)
            .send({ email: faker.internet.email(), password })
            .set('Accept', 'application/json')
            .expect(404, [{ path: 'email', message: 'User with this email does not exits, please sign up' }], done);
    });
    it('should fail with wrong password', done => {
        request
            .post(`/login`)
            .send({ email, password: faker.internet.password() })
            .set('Accept', 'application/json')
            .expect(400, [{ path: 'password', message: 'Wrong password' }], done);
    });
    it('should return authenticated user', done => {
        request
            .get(`/me`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res: Response) => {
                if (err) done(err);
                const { body } = res;
                expect(body.id).toBe(1);
                expect(body.email).toBe(email);
                expect(body.firstName).toBe(firstName);
                expect(body.lastName).toBe(lastName);
                expect(body.password).toBeUndefined();
                done();
            });
    });
    it('should fail without authorization', done => {
        request
            .get(`/me`)
            .set('Accept', 'application/json')
            .expect(403, { error: 'Not authenticated' }, done);
    });
    it('should fail with empty token', done => {
        request
            .get(`/me`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ')
            .expect(403, { error: 'Authentication error, please login again' }, done);
    });
    it('should fail with bad token', done => {
        request
            .get(`/me`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer 123')
            .expect(401, { error: 'Not authorized to access this resource' }, done);
    });
    it('should send email and lock the user', done => {
        request
            .post(`/change-password`)
            .send({ email })
            .set('Accept', 'application/json')
            .expect(200, { message: 'Please check your email for the next steps' })
            .end(async err => {
                if (err) done(err);
                const user = await User.findOne(1);
                expect(user.forgotPasswordLocked).toBe(true);
                done();
            });
    });
    it('should change password correctly', async done => {
        const [userKey] = await redis.keys(forgotPasswordPrefix + '*');
        const { data, status } = await axios.post(
            `${process.env.API_BASE}/change-password/${userKey.replace(forgotPasswordPrefix, '')}`,
            {
                password: password2,
            },
        );
        expect(status).toBe(200);
        expect(data).toEqual({ message: 'Password successfully changed' });
        const user = await User.findOne(1);
        expect(user.forgotPasswordLocked).toBe(false);
        const isPasswordUpdated = await bcrypt.compare(password2, user.password);
        expect(isPasswordUpdated).toBe(true);
        done();
    });
});
