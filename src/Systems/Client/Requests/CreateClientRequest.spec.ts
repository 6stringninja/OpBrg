import { Client } from '../Client';
import { CreateClientRequest } from './CreateClientRequest';
import { container } from 'tsyringe';
import { ApplicationTokensSerializerJsonFileService } from '../../Services/SerializeService';
import { Server } from '../../Server/Server';
import { ServerState } from '../../Server/ServerState';
import express = require('express');
import { IMessageResultBase } from '../../Server/Messages/Base/MessageResultBase';
import { GetTokenMessageResult, GetTokenMessageInput } from '../../Server/Messages/GetTokenMessage';
import { CreateClientMessageResult, CreateClientMessageInput } from '../../Server/Messages/CreateClientMessage';
describe('Create Client Request', function () {
    let client: Client;
    let test: CreateClientRequest;
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
        test = new CreateClientRequest(client);
        req = {} as express.Request;
        res = {} as express.Response;
        res.send = function (b: any) {
            sendResult = b;
            return b;
        };

        req = {} as express.Request;
        res = {} as express.Response;
        res.send = function (b: any) {

            sendResult = b;
            return b;
        };

        serverState.resetAll();


    });


    it('should succeed with valid input', async function (done) {

        test.messageInput.clientpassword = 'test';
        test.messageInput.name = 'test';
        test.messageInput.serverpassword = server.config.serverPassword;
       const t = await test.post();

        expect((t as IMessageResultBase).success).toBeTruthy();
        done();
    });
});
