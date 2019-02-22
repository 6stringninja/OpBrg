import { Client } from '../Client';
import { IamAliveRequest } from './IamAliveRequest';
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
    let test: IamAliveRequest;
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

    beforeEach(async (done) => {
        client = new Client();
        test = new IamAliveRequest(client);
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
        serverState.applicationClients.createClient(
            'test',
            server.config.serverPassword,
            'test'
        );
        serverState.applicationClients.createToken(
            'test',
            server.config.serverPassword,
            'test'
        );
        done();

    });


    it('should succeed with valid input', async function (done) {

        test.messageInput.token = serverState.tokens[0];


        const t = await test.post();

        expect((t as IMessageResultBase).success).toBeTruthy();
        done();
    });
});
