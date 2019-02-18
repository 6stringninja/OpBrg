import 'reflect-metadata';
import express = require('express');
import ServerConfig from './ServerConfig.json';
import { IServerConfig } from './ServerConfig';
import { container } from 'tsyringe';

import { ServerDi } from './ServerDi';
import { ServerTokens } from './ServerTokens.js';

export class Server {
  app: express.Application = express();
  serverTokens: ServerTokens;
  constructor(public config: IServerConfig = ServerConfig as IServerConfig) {
    new ServerDi().run(container);
    this.serverTokens = ServerTokens.create(this.config.serverPassword);
    
  }
 
  load(){
   return !!(this.serverTokens.loadClients() &&
    this.serverTokens.loadTokens());
  }
  run() {
    this.load();
    this.app.get('/', function(req: express.Request, res: express.Response) {
      res.send('Hello World!');
    });

    this.app.listen(this.config.port, () => {
      console.log(`Example app listening on port ${this.config.port}!`);
    });
  }
}
