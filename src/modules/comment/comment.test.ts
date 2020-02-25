import axios from 'axios';
import * as requests from 'supertest';

import { createTypeormConn } from '../../utils/createTypeormConn';
import { Post, User } from '../../entity';
import { app } from '../../app';

let request: requests.SuperTest<any>, token: string;

const email = 'commentTest@test.com',
    password = 'commentTest',
    content = "It's a comment test",
    postId = 1;

beforeAll(async () => {
    await createTypeormConn();

    const user = await User.create({
        email,
        password,
        firstName: 'commentRoutes',
        lastName: 'commentRoutes',
        confirmed: true,
    });
    await user.save();

    const { data } = await axios.post(process.env.API_BASE + '/login', { email, password });
    token = data.token;

    await Post.create({ title: 'title', body: 'body', owner: user }).save();

    request = requests(app);
});

describe('Comment routes', () => {
    it('should create a comment', done => {
        request
            .post(`/comment/${postId}`)
            .send({ content })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(async err => {
                if (err) done(err);
                const post = await Post.findOne({ relations: ['comments'] });
                expect(post.comments.length).toBe(1);
                done();
            });
    });
    it('should fail with empty content', done => {
        request
            .post(`/comment/${postId}`)
            .send({ content: '' })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400, [{ path: 'content', message: 'content is a required field' }], done);
    });
    it('should update a comment', done => {
        const newContent = 'New content';
        request
            .put('/comment/1')
            .send({ content: newContent })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(async err => {
                if (err) done(err);
                const post = await Post.findOne({ relations: ['comments'] });
                expect(post.comments[0].content).toBe(newContent);
                done();
            });
    });
    it('should delete a comment', done => {
        request
            .delete(`/comment/1`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, { message: 'Success' })
            .end(async err => {
                if (err) done(err);
                const post = await Post.findOne({ relations: ['comments'] });
                expect(post.comments.length).toBe(0);
                done();
            });
    });
});
