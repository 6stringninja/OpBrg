
import { ApplicationTokenHelper } from './Application/ApplicationTokenHelper';
import { ApplicationClients } from './Application/ApplicationClients';
import { isUndefined } from 'util';
import { ServerTokenValidateResult } from './ServerTokenValidateResult';
import { ApplicationToken } from './Application/ApplicationToken';


export class ServerTokens {
  tokens: ApplicationToken[] = [];
  applicationClients: ApplicationClients;

  constructor(public password = ApplicationTokenHelper.generateIdentifier()) {
    this.applicationClients =  ApplicationClients.create(this);
  }

  getToken(name: string): ApplicationToken | undefined {
    return this.tokens.find(f => f.name == name);
  }

  addOrUpdateToken(token: ApplicationToken | undefined): ApplicationToken | undefined {
    if (this.isEmptyToken(token)) return token;
    if (isUndefined(token)) return token;
    const findTokenIndex = this.findTokenIndexByName(token);
    if (findTokenIndex > -1) {
      this.tokens[findTokenIndex] = token;
    } else {
      this.tokens.push(token);
    }
    return token.clone();
  }

  isValidServerPassword(password: string): boolean {
    return !!(password && this.password && this.password === password);
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
    const isValidatedToken = !!this.isValidToken(token);
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
  ): ApplicationToken | undefined =>
    ApplicationTokenHelper.isAboutToExpire(token)
      ? this.addOrUpdateToken(ApplicationTokenHelper.setTokenIssuedAndId(token))
      : token;

  private isEmptyToken = (token: ApplicationToken | undefined) => !(token && token.name);
  private findTokenIndexByName = (token: ApplicationToken) =>
    this.tokens.findIndex(f => f.name === token.name);
}
