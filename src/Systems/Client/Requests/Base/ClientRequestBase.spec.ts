import { Client } from '../../Client';
import { TestClientRequest } from '../TestClientRequest';
import { container } from 'tsyringe';
import { ApplicationTokensSerializerJsonFileService } from '../../../Services/SerializeService';
import { Server } from '../../../Server/Server';
import { ServerState } from '../../../Server/ServerState';
import express = require('express');
import { IMessageResultBase } from '../../../Server/Messages/Base/MessageResultBase';
describe('client config', function() {
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

  beforeEach( () => {
    client = new Client();
    test = new TestClientRequest(client);
    req = {} as express.Request;
    res = {} as express.Response;
    res.send = function(b: any) {
      sendResult = b;
      return b;
    };
  });
  it('should create apiurl with port', function() {
    const copyconfig = client.config;
    copyconfig.port = 3001;
    test = new TestClientRequest(new Client(copyconfig));
    expect(test.apiUrl.indexOf(`:${client.config.port}`)).toBeGreaterThan(-1);
  });
  it('should create apiurl without port', function() {
    let copyconfig = client.config;
    copyconfig.port = 80;
    test = new TestClientRequest(new Client(copyconfig));
    expect(test.apiUrl.indexOf(copyconfig.port.toString())).toBe(-1);
    client.reset();
    copyconfig = client.config;
    copyconfig.port = 3001;
    test = new TestClientRequest(new Client(copyconfig));
  });
  it('should create apiurl end with route', function() {
    expect(test.apiUrl.endsWith(test.routeName)).toBeTruthy();
  });
  it('should create apiurl start with servername', function() {
    expect(
      test.apiUrl.startsWith(`http://${client.config.server}`)
    ).toBeTruthy();
  });
  it('should post test message', async function(done) {
    const t = await test.post();

    expect((t as IMessageResultBase).success).toBeTruthy();
    done();
  });
});
