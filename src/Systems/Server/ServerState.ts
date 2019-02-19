import { ApplicationTokenHelper } from '../Application/ApplicationTokenHelper';
import { ApplicationClients } from '../Application/ApplicationClients';
import { isUndefined } from 'util';
import { ServerTokenValidateResult } from './ServerTokenValidateResult';
import { ApplicationToken } from '../Application/ApplicationToken';
import { container, inject, autoInjectable } from 'tsyringe';
import {
  ISerializerService,
  ApplicationTokensSerializerJsonFileService,
  ApplicationClientsSerializerJsonFileService
} from '../Services/SerializeService';

container.registerSingleton(
  'ISerializerService<ApplicationClient[]>',
  ApplicationClientsSerializerJsonFileService
);
container.register('ISerializerService<ApplicationToken[]>', {
  useClass: ApplicationTokensSerializerJsonFileService
});

@autoInjectable()
export class ServerState {
  tokens: ApplicationToken[] = [];
  applicationClients: ApplicationClients;
  password = ApplicationTokenHelper.generateIdentifier();
  constructor(
    @inject('ISerializerService<ApplicationToken[]>')
    public serializeTokensService: ISerializerService<ApplicationToken[]>
  ) {
    const result = this.serializeTokensService.deserialize();
    if (result.success && result.result) {
      this.tokens = result.result;
    }
    this.applicationClients = ApplicationClients.create(this);
  }
  static create(password = ApplicationTokenHelper.generateIdentifier()) {
    const obj = container.resolve(ServerState);
    obj.password = password;

    return obj;
  }

  getToken(name: string): ApplicationToken | undefined {
    return this.tokens.find(f => f.name == name);
  }

  addOrUpdateToken(
    token: ApplicationToken | undefined
  ): ApplicationToken | undefined {
    if (this.isEmptyToken(token)) return token;
    if (isUndefined(token)) return token;
    const findTokenIndex = this.findTokenIndexByName(token);
    if (findTokenIndex > -1) {
      this.tokens[findTokenIndex] = token;
    } else {
      this.tokens.push(token);
    }
    this.writeTokens();
    return token.clone();
  }

  isValidServerPassword(password: string): boolean {
    return !!(password && this.password && this.password === password);
  }
  isValidClientPassword(name:string, password: string): boolean {
    
    return !!(password && this.password && this.password === password);
  }
  authenticateNewClientToken = (
    name: string,
    password: string
  ): ApplicationToken | undefined =>
{  const token =   name && this.applicationClients.isAuthorizedClient(name,password )
      ? this.addOrUpdateToken(ApplicationTokenHelper.createToken(name))
      : undefined;

      return token;
    }
  authenticateNewToken = (
    name: string,
    password: string
  ): ApplicationToken | undefined =>
    name &&  this.isValidServerPassword(password)
      ? this.addOrUpdateToken(ApplicationTokenHelper.createToken(name))
      : undefined;

  isValidToken = (token: ApplicationToken) =>
   { let tokenRequired =  token &&
    token.name &&
    token.id &&
    token.issued &&
    token.issued > new Date().getTime();
   // console.log({isvalid: tokenRequired,token:token,tokens:this.tokens})
    tokenRequired = tokenRequired &&
    this.tokens.some(
      s =>
        s.name === token.name && s.id === token.id && s.issued === token.issued
    );
  return tokenRequired;}

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
  loadTokens() {
    return this.serializeTokensService.dataExists()
      ? this.readTokens()
      : this.writeTokens();
  }
  writeTokens() {
    
    return this.serializeTokensService.serialize(this.tokens).success;
  }
  readTokens() {
    const dataResult = this.serializeTokensService.deserialize();

    if (dataResult.success && dataResult.result) {
      this.tokens = dataResult.result;
      return dataResult.success;
    }
    return false;
  }
  loadClients() {
    return this.applicationClients.serializeService.dataExists()
      ? this.readClients()
      : this.writeClients();
  }
  writeClients() {
    return this.applicationClients.serializeService.serialize(
      this.applicationClients.clients
    ).success;
  }
  readClients() {
    const dataResult = this.applicationClients.serializeService.deserialize();

    if (dataResult.success && dataResult.result) {
      this.applicationClients.clients = dataResult.result;
      return dataResult.success;
    }
    return false;
  }
  resetTokens() {
    this.tokens = [];
    this.writeTokens();
  }
  resetClients() {
    this.applicationClients.clients = [];
    this.writeClients();
  }
  resetAll() {
    this.resetClients();
    this.resetTokens();
  }
  loadAll() {
    return !!(this.loadClients() && this.loadTokens());
  }

  private filterOutExpiredTokens = () =>
    this.tokens.filter(f => f.issued < new Date().getTime());

  private updateSoonToExpireToken = (
    token: ApplicationToken
  ): ApplicationToken | undefined =>
    ApplicationTokenHelper.isAboutToExpire(token)
      ? this.addOrUpdateToken(ApplicationTokenHelper.setTokenIssuedAndId(token))
      : token;

  private isEmptyToken = (token: ApplicationToken | undefined) =>
    !(token && token.name);
  private findTokenIndexByName = (token: ApplicationToken) =>
    this.tokens.findIndex(f => f.name === token.name);
}
