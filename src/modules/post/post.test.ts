import * as requests from 'supertest';
import axios from 'axios';

import { createTypeormConn } from '../../utils/createTypeormConn';
import { app } from '../../app';
import { User } from '../../entity';
import { Response } from 'supertest';

export let request: requests.SuperTest<any>, token: string;

const title = "It's post title",
    body = "It's a post body";

beforeAll(async () => {
    await createTypeormConn();
    const email = 'postTest@test.com',
        password = 'postRoutes';

    await User.create({ email, password, firstName: 'postRoutes', lastName: 'postRoutes', confirmed: true }).save();

    const { data } = await axios.post(process.env.API_BASE + '/login', { email, password });
    token = data.token;

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
});
