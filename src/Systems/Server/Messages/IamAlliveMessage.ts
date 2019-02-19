import { ServerState } from '../ServerState';
import { MessageInputBase } from './Base/MessageInputBase';
import { MessageResultBase } from './Base/MessageResultBase';
import {
  MessageWrapperBase,
  ErrorMessageResult
} from './Base/MessageWrapperBase';
import express = require('express');
import { MessageTypes } from "./Base/MessageTypes";

export class IamAliveMessageInput extends MessageInputBase {
  constructor(public sentat = new Date().getTime()) {
    super(MessageTypes.IamAliveMessage);
  }
}
export class IamAliveMessageResult extends MessageResultBase<string> {
  constructor(success = false, public sentat = new Date().getTime()) {
    super(MessageTypes.IamAliveMessage);
    this.success = success;
  }
}
export class IamAliveMessageWrapper extends MessageWrapperBase<
  string,
  IamAliveMessageInput,
  IamAliveMessageResult
> {
  constructor(serverState: ServerState) {
    super(
      'iamalive',
      new IamAliveMessageInput(),
      new IamAliveMessageResult(),
      serverState
    );
  }
  process(
    req: express.Request,
    res: express.Response,
    serverState: ServerState
  ): void {
    const input = this.messageInput;
    if (!(input && input.sentat)) {
      res.send(new ErrorMessageResult('invalid input'));
    } else {
      this.messageResult.sentat = new Date().getTime();
      this.messageResult.success = true;

      res.send(this.messageResult);
    }
  }
}
