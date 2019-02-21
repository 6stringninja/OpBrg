import 'reflect-metadata';
import express = require('express');
import ServerConfig from '../Config/ServerConfig.json';
import { IServerConfig } from './ServerConfig';
import { container } from 'tsyringe';
import { ServerDi } from './ServerDi';
import { ServerState } from './ServerState';
import { IMessageWrapper } from './Messages/Base/MessageWrapperBase';
import { Messages } from './Messages/index';

export class Server {
  app: express.Application = express();
  serverState: ServerState | undefined;
  serverMessages: IMessageWrapper[] = [];
  serverRoutePrefix = 'api';
  listener: import('http').Server | undefined;

  constructor(public config: IServerConfig = ServerConfig as IServerConfig) {
    new ServerDi().load(container);
    this.serverState = ServerState.create(config.serverPassword);
    if (!this.serverState.loadAll())
      throw new Error('failed to load json files');
  }
  private getApiUrl = (name: string) => `/${this.serverRoutePrefix}/${name}`;

  async initMessages() {
    this.serverMessages = Messages(this.serverState);
    this.serverMessages.forEach(m => {
      this.app.post(
        this.getApiUrl(m.name),
        (req: express.Request, res: express.Response) =>
          m.processExpress(req, res)
      );
    });
  }

  async start() {
    this.app.use(express.json());
    await this.initMessages();
    this.listener = this.app.listen(this.config.port, () => {
      console.log(
        `OpBorg listening on port http://localhost:${this.config.port}/ !`
      );
    });
  }

  async stop() {
    if (this.listener) {
      this.listener.close();
    }
  }
}
