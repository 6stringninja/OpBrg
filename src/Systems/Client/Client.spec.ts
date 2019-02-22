import { Client } from './Client';
import { ApplicationTokenHelper } from '../Application/ApplicationTokenHelper';

describe('Client', function() {
  let client: Client = undefined;
  beforeEach(function() {
    client = new Client();
  });
  it('should be defined', function() {
    expect(client).toBeDefined();
  });
  it('should be define clientState', function() {
    expect(client.clientState).toBeDefined();

  });
  it('should be define clientState with name & pw', function() {
    expect(client.clientState.stateData.client.name).toBe('test-client');
    expect(client.clientState.stateData.client.password).toBe('test');
  });
  it('should be ignore changes written to state and pull  clientState with name & pw from config', function() {
    const ignorethisname = 'ignorethisname';
    const ignorethispw = 'ignorethispassword';
    client.clientState.stateData.client.name = ignorethisname;
    client.clientState.stateData.client.password = ignorethispw;
    client.clientState.writeStateData();
    client = new Client();
    expect(client.clientState.stateData.client.name).toBe('test-client');
    expect(client.clientState.stateData.client.password).toBe('test');

  });
    it('should reset', async function (done) {
      setTimeout(() => {
        const ignorethisname = 'ignorethisname';
        const ignorethispw = 'ignorethispassword';
        const ignorethistokenname = 'ignorethistokenname';
        if (client.clientState.stateData.client.name) {
        client.clientState.stateData.client.name = ignorethisname;
        client.clientState.stateData.client.password = ignorethispw;
        client.clientState.stateData.token.name = ignorethistokenname;
        client.clientState.writeStateData();
        client.reset();
        expect(client.clientState.stateData.client.name).toBe('test-client');
        expect(client.clientState.stateData.client.password).toBe('test');}
        done();
      }, 20);


    });
  it('should not reset token', function () {

    const ignorethistokenname = 'ignorethistokenname';

    const token = ApplicationTokenHelper.createToken(ignorethistokenname);
    token.issued = 2;
    token.id = 'id';
    client.clientState.stateData.token = token;
    client.clientState.writeStateData();
    client = new Client();
    expect(client.clientState.stateData.token.name).toBe(ignorethistokenname);
    expect(client.clientState.stateData.token.issued).toBe(2);
    expect(client.clientState.stateData.token.id).toBe('id');
  });
});
