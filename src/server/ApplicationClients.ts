import { ServerTokens } from './ServerTokens';
import { CreateApplicationClientResult } from './CreateApplicationClientResult';
import { ApplicationClient } from './ApplicationClient';
export class ApplicationClients {
  clients: ApplicationClient[] = [];

  constructor(public serverTokens: ServerTokens) {}

  createClient = (
    name: string,
    serverpassword: string,
    clientpassword: string
  ): CreateApplicationClientResult =>
    this.isValidClientCredentialIsValid(name, serverpassword, clientpassword)
      ? this.validatedCreateApplicationClientResult(name, clientpassword)
      : CreateApplicationClientResult.Error;

  private isValidClientCredentialIsValid = (
    name: string,
    serverpassword: string,
    clientpassword: string
  ): boolean =>
    this.serverTokens.isValidServerPassword(serverpassword) &&
    !!clientpassword &&
    !!name;

  private doesClientNameExist = (name: string): boolean =>
    this.clients.some(s => s.name === name);

  private addClient = (name: string, clientpassword: string): number =>
    this.clients.push(new ApplicationClient(name, clientpassword));

  private validatedCreateApplicationClientResult = (
    name: string,
    clientpassword: string
  ) =>
    this.doesClientNameExist(name)
      ? CreateApplicationClientResult.NameUnavailable
      : this.addClientCreateApplicationClientResult(name, clientpassword);

  private addClientCreateApplicationClientResult = (
    name: string,
    clientpassword: string
  ): CreateApplicationClientResult =>
    !!this.addClient(name, clientpassword)
      ? CreateApplicationClientResult.Success
      : CreateApplicationClientResult.Error;

  isAuthorizedClient(name: string, password: string): boolean {
    return (
      name &&
      password &&
      this.clients.some(s => s.name === name && s.password === password)
    );
  }
}
