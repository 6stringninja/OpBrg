import { ServerTokens } from '../Common/ServerTokens';
import { ApplicationClientCreateResult } from './ApplicationClientCreateResult';
import { ApplicationClients } from './ApplicationClients';
import { SerializerJsonFileService } from '../Services/SerializeService';
import { ApplicationClient } from './ApplicationClient';
import { container } from 'tsyringe';
import { SerializerTestService } from '../Services/SerializerTestService';
container.registerSingleton('ISerializerService<T>', SerializerTestService);
describe('Application Tokens', function () {
  it('should create client', function () {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';
    const t = serverTokens.applicationClients.createClient(
      'test',
      'test',
      'test'
    );

    expect(t).toBe(ApplicationClientCreateResult.Success);
  });
  it('should not create client - name taken', function () {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';
    serverTokens.applicationClients.createClient('test', 'test', 'test');
    const t = serverTokens.applicationClients.createClient(
      'test',
      'test',
      'test'
    );

    expect(t).toBe(ApplicationClientCreateResult.NameUnavailable);
  });

  it('should not create client - incorrect password error', function () {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';

    const t = serverTokens.applicationClients.createClient(
      'test',
      'test2',
      'test2'
    );

    expect(t).toBe(ApplicationClientCreateResult.Error);
  });
  it('should not create client - no name error', function () {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';

    const t = serverTokens.applicationClients.createClient('', 'test', 'test2');

    expect(t).toBe(ApplicationClientCreateResult.Error);
  });
  it('should not create client - no client password', function () {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';

    const t = serverTokens.applicationClients.createClient('test', 'test2', '');

    expect(t).toBe(ApplicationClientCreateResult.Error);
  });
  it('should   create 2 clients  ', function () {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';
    serverTokens.applicationClients.createClient('test', 'test', 'test');
    const t = serverTokens.applicationClients.createClient(
      'test2',
      'test',
      'test'
    );

    expect(serverTokens.applicationClients.clients.length).toBe(2);
  });
  it('should authorize client', function () {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';
    for (let index = 0; index < 5; index++) {
      serverTokens.applicationClients.createClient(
        `test${index}`,
        'test',
        'test'
      );
      expect(
        serverTokens.applicationClients.isAuthorizedClient(`test${index}`, 'test')
      ).toBe(true);
    }
  });
  it('should not authorize client', function () {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';
    serverTokens.applicationClients.createClient('test', 'test', 'test');
    expect(
      serverTokens.applicationClients.isAuthorizedClient('test', 'test2')
    ).toBe(false);
  });

  it('should not authorize client', function () {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';
    serverTokens.applicationClients.createClient('test', 'test', 'test');
    expect(
      serverTokens.applicationClients.isAuthorizedClient('test1', 'test')
    ).toBe(false);
  });
  it('should create ApplicationClients', function () {
    const test = ApplicationClients.create(new ServerTokens());

    expect(test).toBeDefined();
  });
  it('should create ApplicationClients Load', function () {
    container.registerSingleton('ISerializerService<T>', SerializerTestService);
    const test = new ServerTokens('test');
    test.applicationClients.createClient('test', 'test', 'test');
    expect(test.applicationClients.clients.length).toBe(1);
    expect(test.applicationClients.save()).toBeTruthy();
    ((test.applicationClients.serializeService) as SerializerTestService)
      .fakeitems.push(new ApplicationClient('test2', 'test'));

    // expect((test.serializeService as SerializerTestService).fakeitems.length).toBe(1);
    expect(test.applicationClients.load()).toBeTruthy();
    expect(test.applicationClients.clients.length).toBe(2);
  });
  it('should create ApplicationClients Load', async function (done) {
    container.registerSingleton('ISerializerService<T>', SerializerJsonFileService);
    const test = new ServerTokens('test');
    test.applicationClients.createClient('test', 'test', 'test');
    expect(test.applicationClients.clients.length).toBe(1);
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
});
