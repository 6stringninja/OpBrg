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
} from './Messages/CreateClientMessage';
import { ApplicationClientCreateResult } from '../Application/ApplicationClientCreateResult';
import {IMessageWrapper} from './Messages/Base/MessageWrapperBase';
import { Messages } from './Messages/index';
export class Server {
  app: express.Application = express();
  serverState: ServerState | undefined;
  serverMessages: IMessageWrapper[] =[];
  serverRoutePrefix = 'api';
  constructor(public config: IServerConfig = ServerConfig as IServerConfig) {
    new ServerDi().load(container);

    this.serverState = ServerState.create(config.serverPassword);
    if (!this.serverState.loadAll())
      throw new Error('failed to load json files');
  }
  initMessages(){
    this.serverMessages = Messages(this.serverState);
    this.serverMessages.forEach(m => {
      this.app.post(`${this.serverRoutePrefix}/${m.name}`,m.express);
    });
    
  }
  start() {
    this.app.use(express.json());
    this.initMessages();
    this.app.post(
      // SHIT
      '/api/createnew',
      (req: express.Request, res: express.Response) => {
        const param = req.body as CreateClientMessageInput;
        //  console.log(req.body);
        const retrn = new CreateClientMessageResult();
        if (!!param && this.serverState) {
          const result = this.serverState.applicationClients.createClient(
            param.name,
            param.serverpassword,
            param.clientpassword
          );
          //    console.log(result);

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
