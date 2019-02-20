import { Server } from './server';
import {
  TestClientMessageWrapper,
  TestClientMessageInput
} from './Messages/TestClientMessage';
import express = require('express');
import { ServerState } from './ServerState';
import { ApplicationToken } from '../Application/ApplicationToken';
describe('server ', () => {
  it('should load accountItems', () => {
    const test = new Server();

    expect(test.config).toBeTruthy();
  });

  it('should load serverState', () => {
    const test = new Server();

    expect(test.serverState).toBeTruthy();
  });
  it('should load test account', () => {
    const test = new Server();
    test.serverState.applicationClients.createClient(
      'test',
      test.config.serverPassword,
      'test'
    );

    expect(
      test.serverState.applicationClients.isAuthorizedClient('test', 'test')
    ).toBeTruthy();
  });
  it('should generate test account token', () => {
    const test = new Server();
    test.serverState.applicationClients.createClient(
      'test',
      test.config.serverPassword,
      'test'
    );

    const token = test.serverState.authenticateNewClientToken('test', 'test');
    expect(!!token).toBeTruthy();
  });
  it('should generate valid test message with valid token ', () => {
    const test = new Server();
    test.serverState.applicationClients.createClient(
      'test',
      test.config.serverPassword,
      'test'
    );

    const token: ApplicationToken = test.serverState.authenticateNewClientToken(
      'test',
      'test'
    );

    const msg = new TestClientMessageWrapper(test.serverState);
    const req = {} as express.Request;
    const res = {} as express.Response;
    const input = new TestClientMessageInput();
    input.token = token;

    req.body = JSON.stringify(input);
    res.send = function(b: any) {

      return b;
    };

    msg.processExpress(req, res);

    expect(!!msg.authenticated).toBeTruthy();
  });
  it('should reset tokens', () => {
    const test = new Server();
    test.serverState.resetTokens();
    test.serverState.tokens.push(ApplicationToken.create('test'));
    expect(test.serverState.tokens.length).toBe(1);
    test.serverState.writeTokens();
    expect(test.serverState.tokens.length).toBe(1);
    test.serverState.resetTokens();
    expect(test.serverState.tokens.length).toBe(0);
    test.serverState.tokens.push(ApplicationToken.create('test'));
    test.serverState.writeTokens();
    expect(test.serverState.tokens.length).toBe(1);
  });
  it('should generate valid test message with invalid token', () => {
    const test = new Server();
    test.serverState.applicationClients.createClient(
      'test',
      test.config.serverPassword,
      'test'
    );

    const token: ApplicationToken = test.serverState.authenticateNewClientToken(
      'test',
      'test'
    );

    const msg = new TestClientMessageWrapper(test.serverState);
    const req = {} as express.Request;
    const res = {} as express.Response;
    const input = new TestClientMessageInput();
    token.id = '1';
    input.token = token;

    req.body = JSON.stringify(input);
    res.send = function (b: any) {

      return b;
    };

    msg.processExpress(req, res);

    expect(!!(msg.messageResult.error && msg.messageResult.error === 'Invalid Token')).toBeTruthy();
  });
  it('should generate messages', () => {
    const test = new Server();
    test.initMessages();
    expect(test.serverMessages.length).toBe(4);
  });
  it('generate messages names should not have spaces', () => {
    const test = new Server();
    test.initMessages();
    expect(test.serverMessages.some(f => f.name.split(' ').length > 1 )).toBeFalsy();
  });
  it('route prefix name should not have /', () => {
    const test = new Server();
    test.initMessages();
    expect(test.serverRoutePrefix.split('/').length === 1).toBeTruthy();
  });
});
