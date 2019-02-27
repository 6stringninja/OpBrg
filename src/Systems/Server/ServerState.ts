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
import { Server } from './Server';


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
  applicationClients?: ApplicationClients;
  password = ApplicationTokenHelper.generateIdentifier();
  server?: Server;
  constructor(
    @inject('ISerializerService<ApplicationToken[]>')
    public serializeTokensService: ISerializerService<ApplicationToken[]>
  ) {
     this.serializeTokensService.deserialize().then((result)=>{
      if(result.success && result.result) {
        this.tokens = result.result;
  }
    this.applicationClients = ApplicationClients.create(this);

    });
    
  }
  static create(password = ApplicationTokenHelper.generateIdentifier(), server: Server) {
    const obj = container.resolve(ServerState);
    obj.password = password;
    obj.server = server;
    return obj;
  }

  getToken(name: string): ApplicationToken | undefined {
    return this.tokens.find(f => f.name == name);
  }

  async addOrUpdateToken(
    token: ApplicationToken | undefined
  ): Promise<ApplicationToken | undefined> {

    if (this.isEmptyToken(token)) return token;
    if (isUndefined(token)) return token;
    const findTokenIndex = this.findTokenIndexByName(token);
    if (findTokenIndex > -1) {
      this.tokens[findTokenIndex] = token;
    } else {
      this.tokens.push(token);
    }
     if (isUndefined(this.applicationClients) ) return token;
    const index = this.applicationClients.clients.findIndex(
      f => f.name === token.name
    );
    if (index > -1) {
      this.applicationClients.clients[index].lastAccess = new Date().getTime();
    }

   await  this.writeAll();

    return !token.clone ? undefined : token.clone();
  }

  isValidServerPassword(password: string): boolean {
    return !!(password && this.password && this.password === password);
  }
  isValidClientPassword(name: string, password: string): boolean {
    return !!(password && this.password && this.password === password);
  }
  authenticateNewClientToken = async (
    name: string,
    password: string
  ): Promise<ApplicationToken | undefined> => {
    if (isUndefined(this.applicationClients)) return;
    const token =
      name && this.applicationClients.isAuthorizedClient(name, password)
        ? await this.addOrUpdateToken(ApplicationTokenHelper.createToken(name))
        : undefined;

    return token;
  };
  authenticateNewToken = async (
    name: string,
    password: string
  ): Promise<ApplicationToken | undefined> =>
    name && await this.isValidServerPassword(password)
      ? await this.addOrUpdateToken(ApplicationTokenHelper.createToken(name))
      : undefined;

  isValidToken = (token: ApplicationToken) => {
    let tokenRequired =
      token &&
      token.name &&
      token.id &&
      token.issued &&
      token.issued > new Date().getTime();

    tokenRequired =
      tokenRequired &&
      this.tokens.some(
        s =>
          s.name === token.name &&
          s.id === token.id &&
          s.issued === token.issued
      );
    return tokenRequired;
  };

  async validateToken(token: ApplicationToken): Promise<ServerTokenValidateResult> {
    const isValidatedToken = !!this.isValidToken(token);

    return new ServerTokenValidateResult(
      isValidatedToken ? await this.updateSoonToExpireToken(token) : token,
      isValidatedToken
    );
  }
  removeExpiredTokens(): boolean {
    const countPriorToFilter = this.tokens.length;
    this.tokens = this.filterOutExpiredTokens();
    return countPriorToFilter !== this.tokens.length;
  }
  async loadTokens() {
    return await this.serializeTokensService.dataExists()
      ? await this.readTokens()
      : await this.writeTokens();
  }
  async writeTokens() {
    return (await this.serializeTokensService.serialize(this.tokens)).success;
  }
  async readTokens() {
    const dataResult = await this.serializeTokensService.deserialize();

    if (dataResult.success && dataResult.result) {
      this.tokens = dataResult.result;
      return dataResult.success;
    }
    return false;
  }
  async loadClients() {
    if (isUndefined(this.applicationClients)) return;
    return await this.applicationClients.serializeService.dataExists()
      ? await this.readClients()
      : await  this.writeClients();
  }
  async writeClients() {
    if (isUndefined(this.applicationClients)) return;
    return( await this.applicationClients.serializeService.serialize(
      this.applicationClients.clients
    )).success;
  }
  async readClients() {
    if (isUndefined(this.applicationClients)) return;
    const dataResult = await this.applicationClients.serializeService.deserialize();

    if (dataResult.success && dataResult.result) {
      this.applicationClients.clients = dataResult.result;
      return dataResult.success;
    }
    return false;
  }
  async resetTokens() {
    this.tokens = [];
   await this.writeTokens();
  }
  async resetClients() {
    if (isUndefined(this.applicationClients) ) return;
    this.applicationClients.clients = [];
    await this.writeClients();
  }
  async resetAll() {
    await  this.resetClients();
    await this.resetTokens();
  }
  async loadAll() {
    return !!(await this.loadClients() && await this.loadTokens());
  }
  async writeAll() {
    return !!(await this.writeClients() && await this.writeTokens());
  }
  private filterOutExpiredTokens = () =>
    this.tokens.filter(f => f.issued < new Date().getTime());

  private updateSoonToExpireToken = async (
    token: ApplicationToken
  ): Promise<ApplicationToken | undefined> =>
    ApplicationTokenHelper.isAboutToExpire(token)
      ? await this.addOrUpdateToken(ApplicationTokenHelper.setTokenIssuedAndId(token))
      : token;

  private isEmptyToken = (token: ApplicationToken | undefined) =>
    !(token && token.name);
  private findTokenIndexByName = (token: ApplicationToken) =>
    this.tokens.findIndex(f => f.name === token.name);
}
