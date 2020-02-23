import * as faker from 'faker';
import * as requests from 'supertest';
import { Response } from 'supertest';
import axios from 'axios';

import { User } from '../../entity';
import { createTypeormConn } from '../../utils/createTypeormConn';
import { app } from '../../app';

let request: requests.SuperTest<any>;

const users: User[] = [],
    passwords: string[] = [],
    GENERATE_USERS_COUNT = 3;

beforeAll(async () => {
    await createTypeormConn();
    for (let i = 0; i < GENERATE_USERS_COUNT; i++) {
        passwords.push(faker.internet.password());
    }
    for (let i = 0; i < GENERATE_USERS_COUNT; i++) {
        const user = User.create({
            email: `userTest${i}@test.com`,
            password: passwords[i],
            firstName: faker.internet.userName(),
            lastName: faker.internet.userName(),
            confirmed: true,
        });
        users.push(user);
    }
    await User.insert(users);
    request = requests(app);
});

describe('User routes', () => {
    it('should return a user', done => {
        request
            .get('/user/1')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res: Response) => {
                if (err) done(err);
                const { email, firstName, lastName, password } = res.body;
                expect(email).toEqual(users[0].email);
                expect(password).toBeUndefined();
                expect(firstName).toEqual(users[0].firstName);
                expect(lastName).toEqual(users[0].lastName);
                done();
            });
    });
    it('should fail with bad user id', done => {
        request
            .get('/user/bla')
            .set('Accept', 'application/json')
            .expect(400, { error: 'Not valid user id' }, done);
    });
    it('should fail user not found', done => {
        request
            .get(`/user/${users.length + 1}`)
            .set('Accept', 'application/json')
            .expect(404, { error: 'User not found' }, done);
    });
    it('should all a users', done => {
        request
            .get('/user/all')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res: Response) => {
                if (err) done(err);
                expect(res.body.length).toBe(3);
                done();
            });
    });
    it('should return users with offset and limit', done => {
        const offset = 1,
            limit = 1;
        request
            .get(`/user/all?offset=${offset}&limit=${limit}`)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res: Response) => {
                if (err) done(err);
                const slicedUsers = users.slice(offset, offset + limit);
                expect(res.body.length).toBe(slicedUsers.length);
                expect(res.body.map(({ email, firstName, lastName }) => ({ email, firstName, lastName }))).toEqual(
                    slicedUsers.map(({ email, firstName, lastName }) => ({ email, firstName, lastName })),
                );
                done();
            });
    });
    it('should update a user', async done => {
        const [user] = users,
            newFirstName = 'first',
            newLastName = 'last';
        const {
            data: { token },
        } = await axios.post(process.env.API_BASE + '/login', {
            email: user.email,
            password: passwords[0],
        });

        const { status, data } = await axios.put(
            process.env.API_BASE + '/user',
            { firstName: newFirstName, lastName: newLastName },
            { headers: { Authorization: 'Bearer ' + token } },
        );

        expect(status).toBe(200);
        expect(data.firstName).toEqual(newFirstName);
        expect(data.lastName).toEqual(newLastName);

        const updatedUser = await User.findOne(data.id);
        expect(updatedUser.firstName).toEqual(newFirstName);
        expect(updatedUser.lastName).toEqual(newLastName);
        done();
    });
});
