import ClientConfig from '../Config/ClientConfig.json';
import { IClientConfig } from './ClientConfig';
import { ClientState } from './ClientState.js';
export class Client {
  clientState: ClientState | undefined;
  constructor(public config: IClientConfig = ClientConfig as IClientConfig) {
    this.init();
  }
  private init() {
    this.clientState = ClientState.create();
    this.copyConfigToApplicationClient();
  }
  private copyConfigToApplicationClient() {
    if (!this.clientState) return;
    if (this.clientState.stateData && this.clientState.stateData.client) {
      this.clientState.stateData.client.name = this.config.name;
      if (!!this.config.clientPassword)
        this.clientState.stateData.client.password = this.config.clientPassword;
      this.clientState.writeStateData();
    }
  }
  reset = () => {
    if (this.clientState) {
      this.clientState.readStateData();
    }
    this.init();
  };
}
