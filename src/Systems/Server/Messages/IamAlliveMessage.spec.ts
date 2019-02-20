import { container } from 'tsyringe';
import { ApplicationTokensSerializerJsonFileService } from '../../Services/SerializeService';
import { ServerState } from '../ServerState';
import { Server } from '../Server';
import express = require('express');
import {
  IamAliveMessageWrapper,
  IamAliveMessageInput
} from './IamAlliveMessage';
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
  beforeEach(function() {
    req = {} as express.Request;
    res = {} as express.Response;
    res.send = function(b: any) {
     // console.log({ 'sendresult:': b });
      sendResult = b;
      return b;
    };
    server = new Server();
    serverState = server.serverState;
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
  });

  beforeAll(function() {});

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
  it('should succeed setat result ? sentat input', function() {
    const input = new IamAliveMessageInput();
    input.sentat = new Date().getTime();
    input.token = serverState.tokens[0];
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);
    expect(sendResult.sentat > input.sentat).toBeTruthy();
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
