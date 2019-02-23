import { Server } from '../Server';
import express = require('express');
import { MessageInputBase } from '../Messages/Base/MessageInputBase';
import { ApplicationTokenHelper } from '../../Application/ApplicationTokenHelper';
import { getTimestamp } from '../../Application/ApplicationFunctions';
import { MessageResultBase } from '../Messages/Base/MessageResultBase';
export class ClientLoggerMessage {
  id = 0;
  timestamp = getTimestamp();
  name = '';
  success = false;
  messageInput?: MessageInputBase;
  messageResult?: MessageResultBase;
  noonce = '';
  typeOf = '';
}
export class ClientLogger {
  loggerMessages: ClientLoggerMessage[] = [];
  constructor(public server: Server) {}
  private _masterId = 1;
  public get masterId() {
    this._masterId++;
    return this._masterId;
  }

  init() {
    if (this.server.config.clientLoggingEnabled) {
      this.server.app.use((req, res: express.Response, next) => {
        if (req.body && (req.body as MessageInputBase).typeOf) {
          const b = req.body as MessageInputBase;
          if (!b.nonce) b.nonce = ApplicationTokenHelper.generateIdentifier();
          const tn = b.token ? b.token.name : 'noname';
          const logMessage = new ClientLoggerMessage();
          logMessage.id = (this.masterId);
          logMessage.messageInput = b;
          logMessage.noonce = b.nonce;
          logMessage.name = tn;
          logMessage.typeOf = b.typeOf.toString();
          console.log(logMessage);
          this.loggerMessages.push(logMessage);
          if (
            this.loggerMessages.length >
            this.server.config.clientLoggingMaxRecords
          )
            this.loggerMessages.shift();
        }

        next();
      });
    }
  }
}
