import { Client } from '../Client';
import { TestClientRequest } from './TestClientRequest';
import { container } from 'tsyringe';
import { ApplicationTokensSerializerJsonFileService } from '../../Services/SerializeService';
import { Server } from '../../Server/Server';
import { ServerState } from '../../Server/ServerState';
import express = require('express');
import { IMessageResultBase } from '../../Server/Messages/Base/MessageResultBase';
describe('Test Client Request', function () {
    let client: Client;
    let test: TestClientRequest;
    container.register('ISerializerService<ApplicationToken[]>', {
        useClass: ApplicationTokensSerializerJsonFileService
    });
    let server: Server | undefined;
    let serverState: ServerState | undefined;
    let req = {} as express.Request;
    let res = {} as express.Response;
    let sendResult: any | undefined;

    beforeAll(async done => {
        server = new Server();
        serverState = server.serverState;
        server.serverState.resetAll();
        await server.start();
        setTimeout(done, 1);
    });
    afterAll(async done => {
        await server.stop();
        done();
    });

    beforeEach(() => {
        client = new Client();
        test = new TestClientRequest(client);
        req = {} as express.Request;
        res = {} as express.Response;
        res.send = function (b: any) {
            sendResult = b;
            return b;
        };
    });

    it('should post test message', async function (done) {
        const t = await test.post();

        expect((t as IMessageResultBase).success).toBeTruthy();
        done();
    });
    it('should post test message and fail', async function (done) {
        test.messageInput.fail = true;
        const t = await test.post();

        expect((t as IMessageResultBase).success).toBeFalsy();
        done();
    });
    it('should post test message and fail', async function (done) {
        test.messageInput.throw = true;
        const t = await test.post();

        expect((t as IMessageResultBase).success).toBeFalsy();
        done();
    });
});
