import { ServerState } from '../Server/ServerState';
import { ApplicationClientCreateResult } from './ApplicationClientCreateResult';
import { ApplicationClient } from './ApplicationClient';
import { container, autoInjectable, inject } from 'tsyringe';
import {
  ISerializerService,
  ApplicationClientsSerializerJsonFileService
} from '../Services/SerializeService';
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
  load = (): boolean => {
    const result = this.serializeService.deserialize();
    if (result.success && !!result.result) {
      this.clients = result.result;
    }
    return result.success;
  };
  save = (): boolean => this.serializeService.serialize(this.clients).success;

  createClient = (
    name: string,
    serverpassword: string,
    clientpassword: string
  ): ApplicationClientCreateResult =>
    this.isValidClientCredentialIsValid(name, serverpassword, clientpassword)
      ? this.validatedApplicationClientCreateResult(name, clientpassword)
      : ApplicationClientCreateResult.Error;

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

  private addClientApplicationClientCreateResult = (
    name: string,
    clientpassword: string
  ): ApplicationClientCreateResult => {
    const result = !!this.addClient(name, clientpassword)
      ? ApplicationClientCreateResult.Success
      : ApplicationClientCreateResult.Error;
    if (result === ApplicationClientCreateResult.Success) {
      this.save();
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
