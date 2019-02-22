import { container } from 'tsyringe';
import { ApplicationTokensSerializerJsonFileService } from '../../Services/SerializeService';
import { ServerState } from '../ServerState';
import { Server } from '../Server';
import express = require('express');
import {
  IamAliveMessageWrapper,
  IamAliveMessageInput
} from './IamAlliveMessage';
import request = require('request');
import { IMessageResultBase } from './Base/MessageResultBase';
describe('Application Tokens', function() {
  container.register('ISerializerService<ApplicationToken[]>', {
    useClass: ApplicationTokensSerializerJsonFileService
  });
  let server: Server | undefined;
  let serverState: ServerState | undefined;
  let req = {} as express.Request;
  let res = {} as express.Response;
  let sendResult: any | undefined;
  let msg: IamAliveMessageWrapper;
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
  beforeEach( async (done) => {
    req = {} as express.Request;
    res = {} as express.Response;
    res.send = function(b: any) {

      sendResult = b;
      return b;
    };

    serverState.resetAll();
    msg = new IamAliveMessageWrapper(serverState);

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



  it('should authenticate as it is not secure', function() {
    const input = new IamAliveMessageInput();
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);
    expect(!!msg.authenticated).toBeFalsy();
  });
  it('should authenticate as it is not secure', function() {
    const input = new IamAliveMessageInput();
    input.token = serverState.tokens[0];
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);
    expect(!!msg.authenticated).toBeTruthy();
  });
  it('should succeed', function() {
    const input = new IamAliveMessageInput();
    input.token = serverState.tokens[0];
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);
    expect(sendResult.success).toBeTruthy();
  });
  it('should call IamAliveMessageInput ', async done => {
    const input = new IamAliveMessageInput();
    input.token = serverState.tokens[0];

    request.post(
      `http://localhost:${server.config.port}/api/i-am-alive`,
      {
        json: input
      },
      (error, res, body) => {
        if (error) {
          console.error(error);
          done();
          return;
        }

        expect(body.success).toBeTruthy();
        done();
      }
    );
  });
  it('should work', async done => {
    const t  = new Promise<IMessageResultBase>((resolve, reject) => {
      const input = new IamAliveMessageInput();
      input.token = serverState.tokens[0];

      request.post(
        `http://localhost:${server.config.port}/api/i-am-alive`,
        {
          json: input
        },
        (error, res, body) => {
          if (error) {
            console.error(error);
            done();
            reject(error);

          }
          else {
            resolve(body);
          }

        }
      );

     /* setTimeout(() => {
        resolve('success');
      }, 200);*/
    });
    const r = await t.then((s) => {

      done();
    }
     );

  });
  it('should succeed setat result ? sentat input', function() {
    const input = new IamAliveMessageInput();
    input.sentat = new Date().getTime();
    input.token = serverState.tokens[0];
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);
    expect(sendResult.sentat >= input.sentat).toBeTruthy();
  });
  it('should succeed setat result = client lastaccess', function() {
    const input = new IamAliveMessageInput();
    input.sentat = new Date().getTime();
    input.token = serverState.tokens[0];
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);
    expect(sendResult.sentat).toBeLessThan(
      serverState.applicationClients.clients[0].lastAccess + 5
    );
  });
});
