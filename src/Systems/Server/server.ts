import 'reflect-metadata';
import express = require('express');
import ServerConfig from './ServerConfig.json';
import { IServerConfig } from './ServerConfig';
import { container } from 'tsyringe';
import { ServerDi } from './ServerDi';
import { ServerState } from './ServerState';
import {
  CreateClientMessageInput,
  CreateClientMessageResult
} from './Messages/CreateClientMessage.js';
import { ApplicationClientCreateResult } from '../Application/ApplicationClientCreateResult.js';

export class Server {
  app: express.Application = express();
  serverState: ServerState | undefined;
  constructor(public config: IServerConfig = ServerConfig as IServerConfig) {
    new ServerDi().load(container);

    this.serverState = ServerState.create(config.serverPassword);
    if (!this.serverState.loadAll())
      throw new Error('failed to load json files');
  }
  start() {
    console.log(this.config.serverPassword);

    this.app.use(express.json());

    this.app.post(
      // SHIT
      '/api/createnew',
      (req: express.Request, res: express.Response) => {
        const param = req.body as CreateClientMessageInput;
        console.log(req.body);
        const retrn = new CreateClientMessageResult();
        if (!!param && this.serverState) {
          const result = this.serverState.applicationClients.createClient(
            param.name,
            param.serverpassword,
            param.clientpassword
          );
          console.log(result);

          retrn.success = result === ApplicationClientCreateResult.Success;
          retrn.error = retrn.success ? undefined : result.toString();
        }

        res.send(retrn);
      }
    );

    this.app.listen(this.config.port, () => {
      console.log(
        `Example app listening on port http://localhost:${this.config.port}/ !`
      );
    });
  }
}
