import { ServerState } from '../Server/ServerState';
import { ApplicationClientCreateResult } from './ApplicationClientCreateResult';
import { ApplicationClient } from './ApplicationClient';
import { container, autoInjectable, inject } from 'tsyringe';
import {
  ISerializerService,
  ApplicationClientsSerializerJsonFileService
} from '../Services/SerializeService';
import { ApplicationToken } from './ApplicationToken';
container.registerSingleton(
  'ISerializerService<ApplicationClient[]>',
  ApplicationClientsSerializerJsonFileService
);
@autoInjectable()
export class ApplicationClients {
  clients: ApplicationClient[] = [];
  serverTokens: ServerState | undefined;
  constructor(
    @inject('ISerializerService<ApplicationClient[]>')
    public serializeService: ISerializerService<ApplicationClient[]>
  ) {}
  static create(serverTokens: ServerState) {
    const appClients = container.resolve(ApplicationClients);
    appClients.serverTokens = serverTokens;
    return appClients;
  }
  load = async (): Promise<boolean> => {
    const result = await this.serializeService.deserialize();
    if (result.success && !!result.result) {
      this.clients = result.result;
    }
    return result.success;
  };
  save = async (): Promise<boolean> =>
    (await this.serializeService.serialize(this.clients)).success;

  createClient = async (
    name: string,
    serverpassword: string,
    clientpassword: string
  ): Promise<ApplicationClientCreateResult> =>
    await this.isValidClientCredentialIsValid(name, serverpassword, clientpassword)
      ? this.validatedApplicationClientCreateResult(name, clientpassword)
      : ApplicationClientCreateResult.Error;
  createToken = async (
    name: string,
    serverpassword: string,
    clientpassword: string
  ): Promise<ApplicationToken | undefined> =>
    (await this.isValidClientCredentialIsValid(
      name,
      serverpassword,
      clientpassword
    )) && !!this.serverTokens
      ? await this.serverTokens.authenticateNewClientToken(name, clientpassword)
      : undefined;

  private isValidClientCredentialIsValid = (
    name: string,
    serverpassword: string,
    clientpassword: string
  ): boolean =>
    !!(
      this.serverTokens &&
      this.serverTokens.isValidServerPassword(serverpassword) &&
      !!clientpassword &&
      !!name
    );

  private doesClientNameExist = (name: string): boolean =>
    this.clients.some(s => s.name === name);

  private addClient = (name: string, clientpassword: string): number =>
    this.clients.push(new ApplicationClient(name, clientpassword));

  private validatedApplicationClientCreateResult = (
    name: string,
    clientpassword: string
  ) =>
    this.doesClientNameExist(name)
      ? ApplicationClientCreateResult.NameUnavailable
      : this.addClientApplicationClientCreateResult(name, clientpassword);

  private addClientApplicationClientCreateResult = async (
    name: string,
    clientpassword: string
  ): Promise<ApplicationClientCreateResult> => {
    const result = !!this.addClient(name, clientpassword)
      ? ApplicationClientCreateResult.Success
      : ApplicationClientCreateResult.Error;
    if (result === ApplicationClientCreateResult.Success) {
     await this.save();
    }
    return result;
  };

  isAuthorizedClient(name: string, password: string): boolean {
    return !!(
      name &&
      password &&
      this.clients.some(s => s.name === name && s.password === password)
    );
  }
}
