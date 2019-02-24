import { ServerState } from '../Server/ServerState';
import { ApplicationClientCreateResult } from './ApplicationClientCreateResult';
import { ApplicationClients } from './ApplicationClients';
import { container } from 'tsyringe';
import { ApplicationClientSerializerTestService } from '../Services/SerializerTestService';
import { Server } from '../Server/Server';
container.registerSingleton(
  'ISerializerService<T>',
  ApplicationClientSerializerTestService
);
describe('Application Tokens', function() {
  it('should create client', function() {
    const serverState = ServerState.create(undefined, new Server());
    serverState.password = 'test';
    const t = serverState.applicationClients.createClient(
      'test',
      'test',
      'test'
    );

    expect(t).toBe(ApplicationClientCreateResult.Success);
  });
  it('should not create client - name taken', function() {
    const serverState = ServerState.create(undefined, new Server());
    serverState.password = 'test';
    serverState.applicationClients.createClient('test', 'test', 'test');
    const t = serverState.applicationClients.createClient(
      'test',
      'test',
      'test'
    );

    expect(t).toBe(ApplicationClientCreateResult.NameUnavailable);
  });

  it('should not create client - incorrect password error', function() {
    const serverState = ServerState.create(undefined, new Server());
    serverState.password = 'test';

    const t = serverState.applicationClients.createClient(
      'test',
      'test2',
      'test2'
    );

    expect(t).toBe(ApplicationClientCreateResult.Error);
  });
  it('should not create client - no name error', function() {
    const serverState = ServerState.create(undefined, new Server());
    serverState.password = 'test';

    const t = serverState.applicationClients.createClient('', 'test', 'test2');

    expect(t).toBe(ApplicationClientCreateResult.Error);
  });
  it('should not create client - no client password', function() {
    const serverState = ServerState.create(undefined, new Server());
    serverState.password = 'test';

    const t = serverState.applicationClients.createClient('test', 'test2', '');

    expect(t).toBe(ApplicationClientCreateResult.Error);
  });
  it('should   create 2 clients  ', function() {
    const serverState = ServerState.create(undefined, new Server());
    serverState.password = 'test';
    serverState.applicationClients.createClient('test', 'test', 'test');
    const t = serverState.applicationClients.createClient(
      'test2',
      'test',
      'test'
    );

    expect(serverState.applicationClients.clients.length).toBe(2);
  });
  it('should authorize client', function() {
    const serverState = ServerState.create(undefined, new Server());
    serverState.password = 'test';
    for (let index = 0; index < 5; index++) {
      serverState.applicationClients.createClient(
        `test${index}`,
        'test',
        'test'
      );
      expect(
        serverState.applicationClients.isAuthorizedClient(
          `test${index}`,
          'test'
        )
      ).toBe(true);
    }
  });
  it('should not authorize client', function() {
    const serverState = ServerState.create(undefined, new Server());
    serverState.password = 'test';
    serverState.applicationClients.createClient('test', 'test', 'test');
    expect(
      serverState.applicationClients.isAuthorizedClient('test', 'test2')
    ).toBe(false);
  });

  it('should not authorize client', function() {
    const serverState = ServerState.create(undefined, new Server());
    serverState.password = 'test';
    serverState.applicationClients.createClient('test', 'test', 'test');
    expect(
      serverState.applicationClients.isAuthorizedClient('test1', 'test')
    ).toBe(false);
  });
  it('should create ApplicationClients', function() {
    const test = ApplicationClients.create(ServerState.create(undefined, new Server()));

    expect(test).toBeDefined();
  });
});
