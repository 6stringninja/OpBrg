import { Client } from '../Client';
import { container } from 'tsyringe';
import { ApplicationTokensSerializerJsonFileService } from '../../Services/SerializeService';
import { ServerState } from '../../Server/ServerState';
import { Server } from '../../Server/Server';
import { Requests } from '../Requests/index';
import { TestClientMessageInput } from '../../Server/Messages/TestClientMessage';
import { CreateClientMessageInput } from '../../Server/Messages/CreateClientMessage';
import { GetTokenMessageInput } from '../../Server/Messages/GetTokenMessage';
import { IamAliveMessageInput } from '../../Server/Messages/IamAlliveMessage';
describe('requests index', () => {
  let client: Client;
  let test: Requests;
  container.register('ISerializerService<ApplicationToken[]>', {
    useClass: ApplicationTokensSerializerJsonFileService
  });
  let server: Server | undefined;
  let serverState: ServerState | undefined;

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

  beforeEach(async done => {
    client = new Client();
    test = new Requests(client);

    serverState.resetAll();
    done();
  });
  it('should post test request', async done => {
    const input = new TestClientMessageInput();
    input.fail = false;
    const result = await test.Test(input);
    expect(result.success).toBeTruthy();
    done();
  });
  it('should post create client request', async done => {
    const input = new CreateClientMessageInput();
    input.name = client.config.name;
    input.clientpassword = client.config.clientPassword;
    input.serverpassword = client.config.serverPassword;
    const result = await test.CreateClient(input);
    expect(result.success).toBeTruthy();
    expect(result.token.id).toBeTruthy();
    done();
  });
  it('should post create get token', async done => {
    const input = new CreateClientMessageInput();
    input.name = client.config.name;
    input.clientpassword = client.config.clientPassword;
    input.serverpassword = client.config.serverPassword;
    const result = await test.CreateClient(input);
    const inputGetToken = new GetTokenMessageInput();
    inputGetToken.name = input.name;
    inputGetToken.clientpassword = input.clientpassword;
    inputGetToken.serverpassword = input.serverpassword;
    const resultGetToken = await test.GetToken(inputGetToken);
    expect(resultGetToken.success).toBeTruthy();
    expect(resultGetToken.token.id).toBeTruthy();
    done();
  });
  it('should post I am alive', async done => {
    const input = new CreateClientMessageInput();
    input.name = client.config.name;
    input.clientpassword = client.config.clientPassword;
    input.serverpassword = client.config.serverPassword;
    const result = await test.CreateClient(input);
    for (let index = 0; index < 5; index++) {
      const inputIamAlive = new IamAliveMessageInput();

      const resultGetToken = await test.IamAlive(inputIamAlive);
      expect(resultGetToken.success).toBeTruthy();
      expect(resultGetToken.token.id).toBeTruthy();
    }
    done();
  });
});
