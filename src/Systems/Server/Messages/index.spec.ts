import { Server } from '../Server';
import { Messages } from '../Messages/index';

describe('Messages array', function() {
  it('should create array', function() {
    const server = new Server();
    const test = Messages(server.serverState);

    expect(test.length).toBe(3);
  });
});
