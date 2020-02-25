import axios from 'axios';
import * as requests from 'supertest';

import { createTypeormConn } from '../../utils/createTypeormConn';
import { Channel, Message, User } from '../../entity';
import { app } from '../../app';

let request: requests.SuperTest<any>, token: string, token1: string, channelId: string, messageId: number;

const content = "It's a message test content";

beforeAll(async () => {
    const email = 'messageTest@test.com',
        email1 = 'messageTest1@test.com',
        password = 'messageTest';
    await createTypeormConn();

    const user = User.create({
        email,
        password,
        firstName: 'messageRoutes',
        lastName: 'messageRoutes',
        confirmed: true,
    });

    await user.save();

    await User.create({
        email: email1,
        password,
        firstName: 'messageRoutes',
        lastName: 'messageRoutes',
        confirmed: true,
    }).save();

    const { data } = await axios.post(process.env.API_BASE + '/login', { email, password });
    token = data.token;
    const res = await axios.post(process.env.API_BASE + '/login', { email: email1, password });
    token1 = res.data.token;

    const channel = Channel.create({ tag: 'messageTest', name: 'Message Test', owner: user });
    await channel.save();
    channelId = channel.id;

    request = requests(app);
});

describe('Message routes', () => {
    it('should create a message', done => {
        request
            .post(`/message/${channelId}`)
            .send({ content })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(async err => {
                if (err) done(err);
                const messages = await Message.find({ content });
                expect(messages.length).toBe(1);
                messageId = messages[0].id;
                done();
            });
    });
    it('should fail with empty content', done => {
        request
            .post(`/message/${channelId}`)
            .send({ content: '' })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400, [{ path: 'content', message: 'content is a required field' }], done);
    });
    it('should return a messages', done => {
        request
            .get(`/message/all/${channelId}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(async (err, res) => {
                if (err) done(err);
                expect(res.body.length).toBe(1);
                expect(res.body[0].content).toBe(content);
                done();
            });
    });
    it('should fail with message not found', done => {
        request
            .put(`/message/123`)
            .send({ content })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(404, { error: 'Message not found' }, done);
    });
    it('should fail with access denied', done => {
        request
            .put(`/message/${messageId}`)
            .send({ content })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token1)
            .expect(403, { error: 'Permission denied' }, done);
    });
    it('should update a message', done => {
        const newContent = 'new content';
        request
            .put(`/message/${messageId}`)
            .send({ content: newContent })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(async (err, res) => {
                if (err) done(err);
                expect(res.body.content).toBe(newContent);
                const message = await Message.findOne(messageId);
                expect(message.content).toBe(newContent);
                done();
            });
    });
    it('should fail without messageIds', done => {
        request
            .delete(`/message`)
            .send({})
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token1)
            .expect(400, { error: 'Please provide messageIds' }, done);
    });
    it('should fail with access denied to delete', done => {
        request
            .delete(`/message`)
            .send({ messageIds: [messageId] })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token1)
            .expect(403, { error: 'You can delete only your own messages' }, done);
    });
    it('should delete a message', done => {
        request
            .delete(`/message`)
            .send({ messageIds: [messageId] })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(async err => {
                if (err) done(err);
                const messages = await Message.find({ id: messageId });
                expect(messages.length).toBe(0);
                done();
            });
    });
});
