import { ApplicationToken } from './ApplicationToken';
import { ApplicationTokenHelper } from './ApplicationTokenHelper';
import { ApplicationClients } from './ApplicationClients';
export class ServerTokenValidateResult {
  constructor(public token: ApplicationToken, public success = false) {}
}
export class ServerTokens {
  tokens: ApplicationToken[] = [];
  applicationClients: ApplicationClients;

  constructor(public password = ApplicationTokenHelper.generateIdentifier()) {
    this.applicationClients = new ApplicationClients(this);
  }

  getToken(name: string): ApplicationToken {
    return this.tokens.find(f => f.name == name);
  }

  addOrUpdateToken(token: ApplicationToken): ApplicationToken {
    if (this.isEmptyToken(token)) return token;
    const findTokenIndex = this.findTokenIndexByName(token);
    if (findTokenIndex > -1) {
      this.tokens[findTokenIndex] = token;
    } else {
      this.tokens.push(token);
    }
    return token.clone();
  }

  isValidServerPassword(password: string): boolean {
    return password && this.password && this.password === password;
  }

  authenticateNewToken = (
    name: string,
    password: string
  ): ApplicationToken | undefined =>
    name && this.isValidServerPassword(password)
      ? this.addOrUpdateToken(ApplicationTokenHelper.createToken(name))
      : undefined;

  isValidToken = (token: ApplicationToken) =>
    token &&
    token.name &&
    token.id &&
    token.issued &&
    token.issued > new Date().getTime() &&
    this.tokens.some(
      s =>
        s.name === token.name && s.id === token.id && s.issued === token.issued
    );

  validateToken(token: ApplicationToken): ServerTokenValidateResult {
    const isValidatedToken = this.isValidToken(token);
    return new ServerTokenValidateResult(
      isValidatedToken ? this.updateSoonToExpireToken(token) : token,
      isValidatedToken
    );
  }
  removeExpiredTokens(): boolean {
    const countPriorToFilter = this.tokens.length;
    this.tokens = this.filterOutExpiredTokens();
    return countPriorToFilter !== this.tokens.length;
  }

  private filterOutExpiredTokens = () =>
    this.tokens.filter(f => f.issued < new Date().getTime());

  private updateSoonToExpireToken = (
    token: ApplicationToken
  ): ApplicationToken =>
    ApplicationTokenHelper.isAboutToExpire(token)
      ? this.addOrUpdateToken(ApplicationTokenHelper.setTokenIssuedAndId(token))
      : token;

  private isEmptyToken = (token: ApplicationToken) => !(token && token.name);
  private findTokenIndexByName = (token: ApplicationToken) =>
    this.tokens.findIndex(f => f.name === token.name);
}
