import { Server } from '../Server';
import { Messages } from '../Messages/index';
import request from 'request';
import { CreateClientMessageInput } from './CreateClientMessage';
import { ApplicationToken } from '../../Application/ApplicationToken';
import { doesNotReject } from 'assert';
describe('Messages array', function() {
  server: Server;
  beforeAll( async (done ) => {
    this.server = new Server();
    this.server.serverState.resetAll();
    await this.server.start();
    setTimeout(done, 1);
  });
  afterAll(async (done) => {
    await this.server.stop();
     done();
  });
  it('should createClientRequest', async (done) => {
    const createClientRequest = new CreateClientMessageInput('test', 'test', '1234');
createClientRequest.token = ApplicationToken.create();
    request.post(`http://localhost:${this.server.config.port}/api/create-client`, {
      json:  createClientRequest
    }, (error, res, body) => {
      if (error) {
        console.error(error);
        done();
        return;
      }
     // ABC.log(`statusCode: ${res.statusCode}`);

      done();
    });
    const test = Messages(this.server.serverState);
    expect(test.length).toBe(4);
  });
});
