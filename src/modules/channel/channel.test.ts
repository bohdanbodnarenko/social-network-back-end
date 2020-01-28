import axios from 'axios';
import { Response } from 'supertest';

import { request } from '../../tests/setup';
import { Channel, User } from '../../entity';

const email = 'testChannel@test.com',
    password = 'testChannel',
    email1 = 'testChannel2@test.com',
    password1 = 'testChannel2',
    name = 'newChannel',
    tag = 'newChannel';

let token = '',
    token1 = ',',
    channelId = '';

describe('Channel routes', () => {
    it('should insert a test user', async done => {
        const user = User.create({ email, password, firstName: 'firstName', lastName: 'lastName', confirmed: true });
        await user.save();

        await User.create({
            email: email1,
            password: password1,
            firstName: 'firstName',
            lastName: 'lastName',
            confirmed: true,
        }).save();

        const { data } = await axios.post(process.env.API_BASE + '/login', { email, password });
        token = data.token;

        const { data: data1 } = await axios.post(process.env.API_BASE + '/login', {
            email: email1,
            password: password1,
        });
        token1 = data1.token;

        expect(token).toBeTruthy();
        done();
    });
    it('should create a channel', done => {
        request
            .post('/channel')
            .send({ tag, name })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(async (err, res: Response) => {
                if (err) done(err);
                const { body } = res;

                channelId = body.id;
                expect(body.tag).toEqual(tag);
                expect(body.name).toEqual(name);

                const channel = await Channel.findOne({ where: { id: body.id }, relations: ['owner'] });
                expect(channel.owner.email).toBe(email);

                const user = await User.findOne({ where: { email }, relations: ['ownChannels'] });
                const [ownChannel] = user.ownChannels;

                expect(ownChannel.tag).toBe(tag);
                expect(ownChannel.name).toBe(name);

                done();
            });
    });
    it('should fail with duplicate tag', done => {
        request
            .post('/channel')
            .send({ tag, name })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400, [{ path: 'tag', message: 'This tag is taken already' }], done);
    });
    it('should return a channel', done => {
        request
            .get(`/channel/${channelId}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res: Response) => {
                if (err) done(err);
                const { body } = res;

                expect(body.name).toBe(name);
                expect(body.tag).toBe(tag);

                done();
            });
    });
    it('should fail with not a member', done => {
        request
            .get(`/channel/${channelId}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token1)
            .expect(403, { error: 'Access denied' }, done);
    });
    it('should return my channels', done => {
        request
            .get(`/channel/my`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, { error: 'Access denied' }, done);
    });
});
