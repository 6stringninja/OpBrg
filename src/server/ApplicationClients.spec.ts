import { ServerTokens } from './ServerTokens';
import { CreateApplicationClientResult } from './CreateApplicationClientResult';

describe('Application Tokens', function() {
  it('should create client', function() {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';
    const t = serverTokens.applicationClients.createClient(
      'test',
      'test',
      'test'
    );

    expect(t).toBe(CreateApplicationClientResult.Success);
  });
  it('should not create client - name taken', function() {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';
    serverTokens.applicationClients.createClient('test', 'test', 'test');
    const t = serverTokens.applicationClients.createClient(
      'test',
      'test',
      'test'
    );

    expect(t).toBe(CreateApplicationClientResult.NameUnavailable);
  });

  it('should not create client - incorrect password error', function() {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';

    const t = serverTokens.applicationClients.createClient(
      'test',
      'test2',
      'test2'
    );

    expect(t).toBe(CreateApplicationClientResult.Error);
  });
  it('should not create client - no name error', function() {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';

    const t = serverTokens.applicationClients.createClient('', 'test', 'test2');

    expect(t).toBe(CreateApplicationClientResult.Error);
  });
  it('should not create client - no client password', function() {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';

    const t = serverTokens.applicationClients.createClient('test', 'test2', '');

    expect(t).toBe(CreateApplicationClientResult.Error);
  });
  it('should   create 2 clients  ', function() {
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
  it('should authorize client', function() {
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
  it('should not authorize client', function() {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';
    serverTokens.applicationClients.createClient('test', 'test', 'test');
    expect(
      serverTokens.applicationClients.isAuthorizedClient('test', 'test2')
    ).toBe(false);
  });

  it('should not authorize client', function() {
    const serverTokens = new ServerTokens();
    serverTokens.password = 'test';
    serverTokens.applicationClients.createClient('test', 'test', 'test');
    expect(
      serverTokens.applicationClients.isAuthorizedClient('test1', 'test')
    ).toBe(false);
  });
});
