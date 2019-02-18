import { ServerState } from '../Server/ServerState';
import { ApplicationClientCreateResult } from './ApplicationClientCreateResult';
import { ApplicationClients } from './ApplicationClients';
import {
  SerializerJsonFileService,
  ApplicationClientsSerializerJsonFileService
} from '../Services/SerializeService';
import { ApplicationClient } from './ApplicationClient';
import { container } from 'tsyringe';
import { ApplicationClientSerializerTestService } from '../Services/SerializerTestService';
container.registerSingleton('ISerializerService<T>', ApplicationClientSerializerTestService);
describe('Application Tokens', function() {
  it('should create client', function() {
    const serverState = ServerState.create();
    serverState.password = 'test';
    const t = serverState.applicationClients.createClient(
      'test',
      'test',
      'test'
    );

    expect(t).toBe(ApplicationClientCreateResult.Success);
  });
  it('should not create client - name taken', function() {
    const serverState = ServerState.create();
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
    const serverState = ServerState.create();
    serverState.password = 'test';

    const t = serverState.applicationClients.createClient(
      'test',
      'test2',
      'test2'
    );

    expect(t).toBe(ApplicationClientCreateResult.Error);
  });
  it('should not create client - no name error', function() {
    const serverState = ServerState.create();
    serverState.password = 'test';

    const t = serverState.applicationClients.createClient('', 'test', 'test2');

    expect(t).toBe(ApplicationClientCreateResult.Error);
  });
  it('should not create client - no client password', function() {
    const serverState = ServerState.create();
    serverState.password = 'test';

    const t = serverState.applicationClients.createClient('test', 'test2', '');

    expect(t).toBe(ApplicationClientCreateResult.Error);
  });
  it('should   create 2 clients  ', function() {
    const serverState = ServerState.create();
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
    const serverState = ServerState.create();
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
    const serverState = ServerState.create();
    serverState.password = 'test';
    serverState.applicationClients.createClient('test', 'test', 'test');
    expect(
      serverState.applicationClients.isAuthorizedClient('test', 'test2')
    ).toBe(false);
  });

  it('should not authorize client', function() {
    const serverState = ServerState.create();
    serverState.password = 'test';
    serverState.applicationClients.createClient('test', 'test', 'test');
    expect(
      serverState.applicationClients.isAuthorizedClient('test1', 'test')
    ).toBe(false);
  });
  it('should create ApplicationClients', function() {
    const test = ApplicationClients.create(ServerState.create());

    expect(test).toBeDefined();
  });
    /*
  it('should create ApplicationClients Load', function() {
    container.registerSingleton('ISerializerService<T>', ApplicationClientSerializerTestService);
    const test = ServerTokens.create('test');
    test.applicationClients.createClient('test', 'test', 'test');
    expect(test.applicationClients.clients.length).toBe(1);
    expect(test.applicationClients.save()).toBeTruthy();
    (test.applicationClients
      .serializeService as ApplicationClientSerializerTestService).fakeitems.push(
      new ApplicationClient('test2', 'test')
    );

    // expect((test.serializeService as SerializerTestService).fakeitems.length).toBe(1);
    expect(test.applicationClients.load()).toBeTruthy();
    expect(test.applicationClients.clients.length).toBe(2);
  });

  it('should create ApplicationClients Load file', async function(done) {
    container.registerSingleton(
      'ISerializerService<ApplicationClient[]>',
      ApplicationClientsSerializerJsonFileService
    );
    const test = ServerTokens.create('test');
    test.applicationClients.createClient('test', 'test', 'test');
    expect(test.applicationClients.clients.length).toBe(2);
    expect(test.applicationClients.save()).toBeTruthy();
    //   ((test.applicationClients.serializeService) as SerializerTestService)
    //    .fakeitems.push(new ApplicationClient('test2', 'test'));

    // expect((test.serializeService as SerializerTestService).fakeitems.length).toBe(1);
    test.applicationClients.clients.length = 0;
    expect(test.applicationClients.clients.length).toBe(0);
    test.applicationClients.createClient('test', 'test', 'test');
    test.applicationClients.createClient('test2', 'test', 'test');
    console.log(test.applicationClients.clients);

    expect(test.applicationClients.clients.length).toBe(2);
    setTimeout(() => {
      test.applicationClients.save();
      setTimeout(() => {
        expect(test.applicationClients.load()).toBeTruthy();
        expect(test.applicationClients.clients.length).toBe(2);
        done();
      }, 100);
    }, 100);
    console.log(test.applicationClients.clients);
  });
  */
});
