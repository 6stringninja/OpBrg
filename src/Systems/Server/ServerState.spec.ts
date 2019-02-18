 
import { ApplicationTokenHelper } from '../Application/ApplicationTokenHelper';
import { ApplicationToken } from '../Application/ApplicationToken';
import { container } from 'tsyringe';
import { ApplicationTokensSerializerJsonFileService } from '../Services/SerializeService';
import { ApplicationTokensSerializerTestService } from '../Services/SerializerTestService';
import {ServerState} from '../Server/ServerState'
import fs from 'fs';

describe('Application Tokens', function() {
  container.register('ISerializerService<ApplicationToken[]>', {
    useClass: ApplicationTokensSerializerTestService
  });
  it('get token', function() {
    const serverState = ServerState.create();
    serverState.addOrUpdateToken(ApplicationTokenHelper.createToken('test'));
    const token = serverState.getToken('test');
    expect(token).toBeDefined();
  });

  it('not get token', function() {
    const serverState = ServerState.create();
    serverState.addOrUpdateToken(ApplicationTokenHelper.createToken('test'));
    const token = serverState.getToken('test2');
    expect(token).toBeFalsy();
  });

  it('default pw should be 27 chars long', function() {
    const serverState = ServerState.create();
    expect(serverState.password.length).toBe(27);
  });

  it('should as token to collection', function() {
    const serverState = ServerState.create();
    serverState.addOrUpdateToken(ApplicationToken.create('test'));
    expect(serverState.tokens.length).toBe(1);
  });

  it('should as update token in collection', function() {
    const serverState = ServerState.create();
    serverState.addOrUpdateToken(ApplicationToken.create('test'));
    const id = serverState.tokens[0].id;
    const nt = ApplicationTokenHelper.createToken('test');
    serverState.addOrUpdateToken(nt);
    expect(serverState.tokens.length).toBe(1);
    expect(serverState.tokens[0].id === id).toBe(false);
  });

  it('should authenticate and return token', function() {
    const serverState = ServerState.create();
    const t = serverState.authenticateNewToken('test', serverState.password);
    expect(serverState.tokens.length).toBe(1);
    expect(serverState.tokens[0].id === t.id).toBe(true);
  });

  it('should not authenticate and return falsey', function() {
    const serverState = ServerState.create();

    const t = serverState.authenticateNewToken('test', 'adfs');

    expect(serverState.tokens.length).toBe(0);
    expect(t).toBeFalsy();
  });

  it('should validate Token return true', function() {
    const serverState = ServerState.create();
    const t = serverState.authenticateNewToken('test', serverState.password);
    expect(serverState.isValidToken(t)).toBeTruthy();
  });

  it('should not validate token when id does not match stored token', function() {
    const serverState = ServerState.create();
    const t = serverState.authenticateNewToken('test', serverState.password);
    t.id = ApplicationTokenHelper.generateIdentifier();
    const res = serverState.isValidToken(t);

    expect(serverState.isValidToken(t)).toBeFalsy();
  });

  it('should not validate token when name does not match stored token', function() {
    const serverState = ServerState.create();
    const t = serverState.authenticateNewToken('test', serverState.password);
    t.name = ApplicationTokenHelper.generateIdentifier();
    const res = serverState.isValidToken(t);
    expect(serverState.isValidToken(t)).toBeFalsy();
  });

  it('should not validate token when name issued not match stored token', function() {
    const serverState = ServerState.create();
    const t = serverState.authenticateNewToken('test', serverState.password);
    t.issued++;
    const res = serverState.isValidToken(t);
    expect(serverState.isValidToken(t)).toBeFalsy();
  });

  it('should not validate token when issued has expired', function() {
    const serverState = ServerState.create();
    const t = serverState.authenticateNewToken('test', serverState.password);
    t.issued = serverState.tokens[0].issued = new Date().getTime() + 100;

    expect(serverState.isValidToken(t)).toBeTruthy();
    t.issued = serverState.tokens[0].issued = new Date().getTime() - 150;
    expect(serverState.isValidToken(t)).toBeFalsy();
  });

  it('should not validate toke or blow up with unexpected data', function() {
    const serverState = ServerState.create();
    serverState.authenticateNewToken('test', serverState.password);
    const copyToken = () => Object.assign({}, serverState.tokens[0]);

    let t = copyToken();
    expect(serverState.isValidToken(t)).toBeTruthy();
    t.id = undefined;

    expect(serverState.isValidToken(t)).toBeFalsy();
    t = copyToken();
    t.name = '';
    expect(serverState.isValidToken(t)).toBeFalsy();
    t = copyToken();
    // tslint:disable-next-line:no-null-keyword
    t.id = null;
    expect(serverState.isValidToken(t)).toBeFalsy();
    t = copyToken();
  });

  it('should remove expired tokens', function() {
    const serverState = ServerState.create();
    for (let index = 0; index < 5; index++) {
      serverState.authenticateNewToken('test' + index, serverState.password);
      if (index % 2) {
        serverState.tokens[index].issued = new Date().getTime() - 1000;
      }
    }
    expect(serverState.tokens.length).toBe(5);
    expect(serverState.removeExpiredTokens()).toBeTruthy();
    expect(serverState.tokens.length).toBe(2);
  });

  it('should  validate token as success', function() {
    const serverState = ServerState.create();
    // tslint:disable-next-line:max-line-length
    expect(
      serverState.validateToken(
        serverState.authenticateNewToken('test', serverState.password)
      ).success
    ).toBeTruthy();
  });

  it('should not  validate token as success', function() {
    const serverState = ServerState.create();
    // tslint:disable-next-line:max-line-length
    const t = serverState.authenticateNewToken('test', serverState.password);
    t.id = '12fs';
    expect(serverState.validateToken(t).success).toBeFalsy();
  });

  it('should not validate token as success', function() {
    const serverState = ServerState.create();
    // tslint:disable-next-line:max-line-length
    const t = serverState.authenticateNewToken('test', serverState.password);
    t.issued = new Date().getTime() - 100;
    expect(serverState.validateToken(t).success).toBeFalsy();
  });

  it('should validate token as success and update soon to expire token', function() {
    const serverState = ServerState.create();
    // tslint:disable-next-line:max-line-length
    const t = serverState.authenticateNewToken('test', serverState.password);
    expect(!!t.id).toBeTruthy();
    expect(!!t.issued).toBeTruthy();
    serverState.tokens[0].issued = t.issued = new Date().getTime() + 100;
    expect(t.issued === serverState.tokens[0].issued).toBeTruthy();
    const tc = t.clone();
    expect(!!tc.id).toBeTruthy();
    expect(!!tc.issued).toBeTruthy();
    const vl = serverState.validateToken(tc);
    expect(vl.success).toBeTruthy();
    expect(tc.id === vl.token.id).toBe(false);
    expect(tc.issued === vl.token.issued).toBe(false);
    expect(tc.name === vl.token.name).toBe(true);
  });
  it('should load tokens', function() {
    const serverState = ServerState.create();
    const deserializeResult = serverState.serializeTokensService.deserialize();
    expect(deserializeResult.success).toBeTruthy();
    serverState.authenticateNewToken('test', serverState.password);
    expect(serverState.tokens.length).toBe(1);
    serverState.authenticateNewToken('test', serverState.password);
    serverState.serializeTokensService.serialize(serverState.tokens);
  });
  //

  it('should load file tokens', function() {
    container.register('ISerializerService<ApplicationToken[]>', {
      useClass: ApplicationTokensSerializerTestService
    });
    const serverState = ServerState.create();
    const deserializeResult = serverState.serializeTokensService.deserialize();
    expect(deserializeResult.success).toBeTruthy();
    serverState.authenticateNewToken('test', serverState.password);
    expect(serverState.tokens.length).toBe(1);
    serverState.authenticateNewToken('test', serverState.password);
    serverState.serializeTokensService.serialize(serverState.tokens);
  });
});
