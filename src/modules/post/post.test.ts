import * as requests from 'supertest';
import axios from 'axios';

import { createTypeormConn } from '../../utils/createTypeormConn';
import { app } from '../../app';
import { User } from '../../entity';
import { Response } from 'supertest';

let request: requests.SuperTest<any>, token: string, token1: string;

const title = "It's post title",
    body = "It's a post body",
    email = 'postTest@test.com',
    password = 'postRoutes',
    email1 = 'postTest2@test.com';

beforeAll(async () => {
    await createTypeormConn();

    const user = await User.create({
        email,
        password,
        firstName: 'postRoutes',
        lastName: 'postRoutes',
        confirmed: true,
    });

    await user.save();

    await User.create({
        email: email1,
        password,
        firstName: 'postRoutes',
        lastName: 'postRoutes',
        confirmed: true,
    }).save();

    const { data } = await axios.post(process.env.API_BASE + '/login', { email, password });
    token = data.token;
    const res = await axios.post(process.env.API_BASE + '/login', { email: email1, password });
    token1 = res.data.token;

    request = requests(app);
});

describe('Post routes', () => {
    it('should create a new post', async done => {
        request
            .post('/post')
            .send({ title, body })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, done);
    });
    it('should return a post by id', done => {
        request
            .get('/post/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res: Response) => {
                if (err) done(err);
                expect(res.body.title).toBe(title);
                expect(res.body.body).toBe(body);
                expect(res.body.owner.email).toBe(email);
                expect(res.body.owner.password).toBeUndefined();

                done();
            });
    });
    it('should return created post', done => {
        request
            .get('/post/all')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res: Response) => {
                if (err) done(err);
                const [post] = res.body;

                expect(res.body.length).toBe(1);
                expect(post.title).toBe(title);
                expect(post.body).toBe(body);

                done();
            });
    });
    it('should return an empty array for posts by userId', done => {
        request
            .get('/post/all?userId=2')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, [], done);
    });
    it('should return posts of following users', async done => {
        const res1 = await axios.get(process.env.API_BASE + '/post/all?onlyFollowing=true', {
            headers: { Authorization: 'Bearer ' + token1 },
        });
        expect(res1.data).toEqual([]);

        await axios.post(
            process.env.API_BASE + `/subscribe/${1}`,
            {},
            {
                headers: { Authorization: 'Bearer ' + token1 },
            },
        );

        const { data } = await axios.get(process.env.API_BASE + '/post/all?onlyFollowing=true', {
            headers: { Authorization: 'Bearer ' + token1 },
        });
        const [post] = data;
        expect(data.length).toBe(1);
        expect(post.title).toBe(title);
        expect(post.body).toBe(body);
        done();
    });
    it('should not allow to update not own post by id', done => {
        request
            .put('/post/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token1)
            .expect(403, { error: "You haven't permission to do this" }, done);
    });
    it('should update post by id', done => {
        const newTitle = 'updatedTitle',
            newBody = 'updatedBody';
        request
            .put('/post/1')
            .send({ title: newTitle, body: newBody })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res: Response) => {
                if (err) done(err);

                expect(res.body.title).toBe(newTitle);
                expect(res.body.body).toBe(newBody);
                done();
            });
    });
    it('should not allow to delete not own post by id', done => {
        request
            .delete('/post/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token1)
            .expect(403, { error: "You haven't permission to do this" }, done);
    });
    it('should delete post by id', done => {
        request
            .delete('/post/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, { message: 'Post deleted successfully' }, done);
    });
});
