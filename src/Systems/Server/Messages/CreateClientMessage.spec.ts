import { container } from 'tsyringe';
import { ApplicationTokensSerializerJsonFileService } from '../../Services/SerializeService';
import { ServerState } from '../ServerState';
import { Server } from '../Server';
import express = require('express');
import {
  CreateClientMessageWrapper,
  CreateClientMessageInput
} from './CreateClientMessage';

describe('Application Tokens', function() {
  container.register('ISerializerService<ApplicationToken[]>', {
    useClass: ApplicationTokensSerializerJsonFileService
  });
  let server: Server | undefined;
  let serverState: ServerState | undefined;
  let req = {} as express.Request;
  let res = {} as express.Response;
  let sendResult: any | undefined;
  let msg: CreateClientMessageWrapper;
  beforeEach( async (done) => {
    req = {} as express.Request;
    res = {} as express.Response;
    res.send = function(b: any) {
      //      console.log({ "sendresult:": b });
      sendResult = b;
      return b;
    };
    server = new Server();
    serverState = server.serverState;
    serverState.resetAll();
    msg = new CreateClientMessageWrapper(serverState);
  // await server.start();
   done();
  });

  beforeAll(function() {});

  it('should authenticate as it is not secure', function() {
    const input = new CreateClientMessageInput();
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);
    expect(!!msg.authenticated).toBeTruthy();
  });
  it('should not succeed when empty input', function() {
    const input = new CreateClientMessageInput();
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);

    expect(sendResult.success).toBeFalsy();
  });
  it('should have error of invalid input', function() {
    const input = new CreateClientMessageInput();
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);

    expect(sendResult.error).toBe('invalid input');
  });
  it('should succeed with valid input', function() {
    const input = new CreateClientMessageInput();
    input.clientpassword = 'test';
    input.name = 'test';
    input.serverpassword = server.config.serverPassword;
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);

    expect(sendResult.success).toBeTruthy();
  });
  it('should fail with invalid server password', function() {
    const input = new CreateClientMessageInput();
    input.clientpassword = 'test';
    input.name = 'test';
    input.serverpassword = 'asfsdf';
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);

    expect(sendResult.success).toBeFalsy();
  });
  it('should fail if name already exists with valid input', function() {
    const input = new CreateClientMessageInput();
    input.clientpassword = 'test';
    input.name = 'test';
    input.serverpassword = server.config.serverPassword;
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);
    msg.processExpress(req, res);
    expect(sendResult.error).toBe('name unavailable');
  });
  it('should return token when success with valid input', function() {
    const input = new CreateClientMessageInput();
    input.clientpassword = 'test';
    input.name = 'test';
    input.serverpassword = server.config.serverPassword;
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);


    expect(sendResult.token).toBeTruthy();
  });

  it('should not return token when success with valid input', function() {
    const input = new CreateClientMessageInput();
    input.clientpassword = 'test';
    input.name = 'test';
    input.serverpassword = 'dfsfsf';
    req.body = JSON.stringify(input);
    msg.processExpress(req, res);

    expect(sendResult.token).toBeFalsy();
  });
});
