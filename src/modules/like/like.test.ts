import axios from 'axios';
import * as requests from 'supertest';

import { createTypeormConn } from '../../utils/createTypeormConn';
import { Post, User } from '../../entity';
import { app } from '../../app';

let request: requests.SuperTest<any>, token: string;

const email = 'likeTest@test.com',
    password = 'likeTest';

beforeAll(async () => {
    await createTypeormConn();

    const user = await User.create({
        email,
        password,
        firstName: 'likeRoutes',
        lastName: 'likeRoutes',
        confirmed: true,
    });

    await user.save();

    const { data } = await axios.post(process.env.API_BASE + '/login', { email, password });
    token = data.token;

    await Post.create({ title: 'title', body: 'body', owner: user }).save();

    request = requests(app);
});

describe('Like routes', () => {
    it('should like a post', async done => {
        request
            .post('/like/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, { message: 'Liked' })
            .end(async err => {
                if (err) done(err);
                const post = await Post.findOne({ relations: ['likes'] });
                expect(post.likes.length).toBe(1);
                done();
            });
    });
    it('should unlike a post', async done => {
        request
            .post('/unlike/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, { message: 'Unliked' })
            .end(async err => {
                if (err) done(err);
                const post = await Post.findOne({ relations: ['likes'] });
                expect(post.likes.length).toBe(0);
                done();
            });
    });
});
