import ClientConfig from '../Config/ClientConfig.json';
import { IClientConfig } from './ClientConfig';
import { ClientState } from './ClientState';
import { MessageResultBase, IMessageResultBase } from '../Server/Messages/Base/MessageResultBase';
import { IClientRequestBase } from './Requests/Base/ClientRequestBase';
export class Client {
  clientState: ClientState | undefined;
  constructor(public config: IClientConfig = ClientConfig as IClientConfig) {
    this.init();
  }
  private async init() {
    this.clientState = await ClientState.create();
    this.copyConfigToApplicationClient();
  }
  private async copyConfigToApplicationClient() {
    if (!this.clientState) return;
    if (this.clientState.stateData && this.clientState.stateData.client) {
      this.clientState.stateData.client.name = this.config.name;
      if (!!this.config.clientPassword)
        this.clientState.stateData.client.password = this.config.clientPassword;
    await  this.clientState.writeStateData();
    }
  }
  reset = async () => {
    if (this.clientState) {
    await  this.clientState.readStateData();
    }
    this.init();
  };
  async updatetoken (result: IClientRequestBase<MessageResultBase> | undefined) {
    if (result && result.authenticated && result.messageResult.success) {
      if (this.clientState && this.clientState.stateData && result.messageResult.token) {
        if (!this.clientState.stateData.token
          || (this.clientState.stateData.token.issued < result.messageResult.token.issued))
        this.clientState.stateData.token = result.messageResult.token;
     await   this.clientState.writeStateData();
      }
    }

  }
}
