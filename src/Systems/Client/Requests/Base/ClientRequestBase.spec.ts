import { Client } from '../../Client';
import { TestClientRequest } from '../TestClientRequest';
describe('client config', function() {
  let client: Client;
  let test: TestClientRequest;
  beforeEach(() => {
    client = new Client();
    test = new TestClientRequest(client);
  });

  it('should create apiurl with port', function() {
    const copyconfig = client.config;
    copyconfig.port = 3001;
    test = new TestClientRequest(new Client(copyconfig));
    expect(test.apiUrl.indexOf(`:${client.config.port}`)).toBeGreaterThan(-1);
  });
  it('should create apiurl without port', function() {
    const copyconfig = client.config;
    copyconfig.port = 80;
    test = new TestClientRequest(new Client(copyconfig));
    expect(test.apiUrl.indexOf(copyconfig.port.toString())).toBe(-1);
    client.reset();
  });
  it('should create apiurl end with route', function() {
    expect(test.apiUrl.endsWith(test.routeName)).toBeTruthy();
  });
  it('should create apiurl start with servername', function() {
    expect(
      test.apiUrl.startsWith(`http://${client.config.server}`)
    ).toBeTruthy();
  });
  it('should fail placeholder for POST', function () {

  });
});
