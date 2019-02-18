import { ServerTokens } from './ServerTokens';
import { ApplicationTokenHelper } from './Application/ApplicationTokenHelper';
import { ApplicationToken } from './Application/ApplicationToken';

describe('Application Tokens', function() {
  it('get token', function() {
    const serverTokens = new ServerTokens();
    serverTokens.addOrUpdateToken(ApplicationTokenHelper.createToken('test'));
    const token = serverTokens.getToken('test');
    expect(token).toBeDefined();
  });

  it('not get token', function() {
    const serverTokens = new ServerTokens();
    serverTokens.addOrUpdateToken(ApplicationTokenHelper.createToken('test'));
    const token = serverTokens.getToken('test2');
    expect(token).toBeFalsy();
  });

  it('default pw should be 27 chars long', function() {
    const serverTokens = new ServerTokens();
    expect(serverTokens.password.length).toBe(27);
  });

  it('should as token to collection', function() {
    const serverTokens = new ServerTokens();
    serverTokens.addOrUpdateToken(  ApplicationToken.create ('test'));
    expect(serverTokens.tokens.length).toBe(1);
  });

  it('should as update token in collection', function() {
    const serverTokens = new ServerTokens();
    serverTokens.addOrUpdateToken(ApplicationToken.create ('test'));
    const id = serverTokens.tokens[0].id;
    const nt = ApplicationTokenHelper.createToken('test');
    serverTokens.addOrUpdateToken(nt);
    expect(serverTokens.tokens.length).toBe(1);
    expect(serverTokens.tokens[0].id === id).toBe(false);
  });

  it('should authenticate and return token', function() {
    const serverTokens = new ServerTokens();
    const t = serverTokens.authenticateNewToken('test', serverTokens.password);
    expect(serverTokens.tokens.length).toBe(1);
    expect(serverTokens.tokens[0].id === t.id).toBe(true);
  });

  it('should not authenticate and return falsey', function() {
    const serverTokens = new ServerTokens();

    const t = serverTokens.authenticateNewToken('test', 'adfs');

    expect(serverTokens.tokens.length).toBe(0);
    expect(t).toBeFalsy();
  });

  it('should validate Token return true', function() {
    const serverTokens = new ServerTokens();
    const t = serverTokens.authenticateNewToken('test', serverTokens.password);
    expect(serverTokens.isValidToken(t)).toBeTruthy();
  });

  it('should not validate token when id does not match stored token', function() {
    const serverTokens = new ServerTokens();
    const t = serverTokens.authenticateNewToken('test', serverTokens.password);
    t.id = ApplicationTokenHelper.generateIdentifier();
    const res = serverTokens.isValidToken(t);

    expect(serverTokens.isValidToken(t)).toBeFalsy();
  });

  it('should not validate token when name does not match stored token', function() {
    const serverTokens = new ServerTokens();
    const t = serverTokens.authenticateNewToken('test', serverTokens.password);
    t.name = ApplicationTokenHelper.generateIdentifier();
    const res = serverTokens.isValidToken(t);
    expect(serverTokens.isValidToken(t)).toBeFalsy();
  });

  it('should not validate token when name issued not match stored token', function() {
    const serverTokens = new ServerTokens();
    const t = serverTokens.authenticateNewToken('test', serverTokens.password);
    t.issued++;
    const res = serverTokens.isValidToken(t);
    expect(serverTokens.isValidToken(t)).toBeFalsy();
  });

  it('should not validate token when issued has expired', function() {
    const serverTokens = new ServerTokens();
    const t = serverTokens.authenticateNewToken('test', serverTokens.password);
    t.issued = serverTokens.tokens[0].issued = new Date().getTime() + 100;

    expect(serverTokens.isValidToken(t)).toBeTruthy();
    t.issued = serverTokens.tokens[0].issued = new Date().getTime() - 150;
    expect(serverTokens.isValidToken(t)).toBeFalsy();
  });

  it('should not validate toke or blow up with unexpected data', function() {
    const serverTokens = new ServerTokens();
    serverTokens.authenticateNewToken('test', serverTokens.password);
    const copyToken = () => Object.assign({}, serverTokens.tokens[0]);

    let t = copyToken();
    expect(serverTokens.isValidToken(t)).toBeTruthy();
    t.id = undefined;

    expect(serverTokens.isValidToken(t)).toBeFalsy();
    t = copyToken();
    t.name = '';
    expect(serverTokens.isValidToken(t)).toBeFalsy();
    t = copyToken();
    // tslint:disable-next-line:no-null-keyword
    t.id = null;
    expect(serverTokens.isValidToken(t)).toBeFalsy();
    t = copyToken();
  });

  it('should remove expired tokens', function() {
    const serverTokens = new ServerTokens();
    for (let index = 0; index < 5; index++) {
      serverTokens.authenticateNewToken('test' + index, serverTokens.password);
      if (index % 2) {
        serverTokens.tokens[index].issued = new Date().getTime() - 1000;
      }
    }
    expect(serverTokens.tokens.length).toBe(5);
    expect(serverTokens.removeExpiredTokens()).toBeTruthy();
    expect(serverTokens.tokens.length).toBe(2);
  });

  it('should  validate token as success', function() {
    const serverTokens = new ServerTokens();
    // tslint:disable-next-line:max-line-length
    expect(
      serverTokens.validateToken(
        serverTokens.authenticateNewToken('test', serverTokens.password)
      ).success
    ).toBeTruthy();
  });

  it('should not  validate token as success', function() {
    const serverTokens = new ServerTokens();
    // tslint:disable-next-line:max-line-length
    const t = serverTokens.authenticateNewToken('test', serverTokens.password);
    t.id = '12fs';
    expect(serverTokens.validateToken(t).success).toBeFalsy();
  });

  it('should not validate token as success', function() {
    const serverTokens = new ServerTokens();
    // tslint:disable-next-line:max-line-length
    const t = serverTokens.authenticateNewToken('test', serverTokens.password);
    t.issued = new Date().getTime() - 100;
    expect(serverTokens.validateToken(t).success).toBeFalsy();
  });

  it('should validate token as success and update soon to expire token', function() {
    const serverTokens = new ServerTokens();
    // tslint:disable-next-line:max-line-length
    const t = serverTokens.authenticateNewToken('test', serverTokens.password);
    expect(!!t.id).toBeTruthy();
    expect(!!t.issued).toBeTruthy();
    serverTokens.tokens[0].issued = t.issued = new Date().getTime() + 100;
    expect(t.issued === serverTokens.tokens[0].issued).toBeTruthy();
    const tc = t.clone();
    expect(!!tc.id).toBeTruthy();
    expect(!!tc.issued).toBeTruthy();
    const vl = serverTokens.validateToken(tc);
    expect(vl.success).toBeTruthy();
    expect(tc.id === vl.token.id).toBe(false);
    expect(tc.issued === vl.token.issued).toBe(false);
    expect(tc.name === vl.token.name).toBe(true);
  });
});
