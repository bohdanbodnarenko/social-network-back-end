import axios from 'axios';
import * as requests from 'supertest';
import { Response } from 'supertest';

import { Channel, User } from '../../entity';
import { app } from '../../app';
import { createTypeormConn } from '../../utils/createTypeormConn';

let request: requests.SuperTest<any>;

beforeAll(async () => {
    await createTypeormConn();
    request = requests(app);
});

const email = 'testChannel@test.com',
    password = 'testChannel',
    email1 = 'testChannel2@test.com',
    password1 = 'testChannel2',
    isPrivate = true,
    name = 'newChannel',
    tag = 'newChannel';

let token = '',
    token1 = ',',
    channelId = '',
    channelId1 = '',
    userId;

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
        userId = data.user.id;

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
            .send({ tag, name, isPrivate })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(async (err, res: Response) => {
                if (err) done(err);
                const { body } = res;

                channelId = body.id;
                expect(body.tag).toEqual(tag);
                expect(body.name).toEqual(name);
                expect(body.isPrivate).toEqual(isPrivate);

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
            .expect(401, [{ path: 'tag', message: 'This tag is taken already' }], done);
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
            .end((err, res: Response) => {
                if (err) return done(err);
                const { body } = res;

                expect(body[0].tag).toBe(tag);
                expect(body[0].name).toBe(name);
                expect(body[0].isPrivate).toBe(isPrivate);
                done();
            });
    });
    it('should add user to channel', async done => {
        const newName = 'testChannel2',
            newTag = 'testChannel1';
        const {
            data: { id: newChannelId },
        } = await axios.post(
            process.env.API_BASE + '/channel',
            { tag: newTag, name: newName, isPrivate: true },
            { headers: { authorization: 'Bearer ' + token1 } },
        );
        channelId1 = newChannelId;

        const { data: addMemberRes } = await axios.post(
            process.env.API_BASE + `/channel/${newChannelId}/addMember/${userId}`,
            {},
            { headers: { authorization: 'Bearer ' + token1 } },
        );
        expect(addMemberRes).toEqual({ message: 'Success' });

        const { data } = await axios.get(process.env.API_BASE + '/channel/my', {
            headers: { authorization: 'Bearer ' + token },
        });
        expect(data.length).toBe(2);
        expect(data[1].tag).toBe(newTag);
        expect(data[1].name).toBe(newName);

        done();
    });
    it('should leave from channel', async done => {
        const { data: leaveRes } = await axios.post(
            `${process.env.API_BASE}/channel/${channelId1}/leave`,
            {},
            { headers: { authorization: 'Bearer ' + token } },
        );
        expect(leaveRes).toEqual({ message: 'Success' });

        const { data } = await axios.get(process.env.API_BASE + '/channel/my', {
            headers: { authorization: 'Bearer ' + token },
        });
        expect(data.length).toBe(1);
        done();
    });
    it('should kick out from channel', async done => {
        await axios.post(
            process.env.API_BASE + `/channel/${channelId1}/addMember/${userId}`,
            {},
            { headers: { authorization: 'Bearer ' + token1 } },
        );

        await axios.post(
            process.env.API_BASE + `/channel/${channelId1}/kickOut/${userId}`,
            {},
            { headers: { authorization: 'Bearer ' + token1 } },
        );

        const { data } = await axios.get(process.env.API_BASE + '/channel/my', {
            headers: { authorization: 'Bearer ' + token },
        });

        expect(data.length).toBe(1);
        done();
    });
    it('should delete a channel', done => {
        request
            .delete(`/channel/${channelId}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200, { message: 'Success' }, done);
    });
});
