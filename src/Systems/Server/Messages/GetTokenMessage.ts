import { ServerState } from '../ServerState';
import { MessageInputBase } from './Base/MessageInputBase';
import { MessageResultBase } from './Base/MessageResultBase';
import {
  MessageWrapperBase,
  ErrorMessageResult
} from './Base/MessageWrapperBase';
import express = require('express');
import { MessageTypes } from './Base/MessageTypes';

export class GetTokenMessageInput extends MessageInputBase {
  constructor(
    public name = '',
    public clientpassword = '',
    public serverpassword = ''
  ) {
    super(MessageTypes.GetTokenMessage);
  }
}
export class GetTokenMessageResult extends MessageResultBase<string> {
  constructor(success = false) {
    super(MessageTypes.GetTokenMessage);
    this.success = success;
  }
}
export class GetTokenMessageWrapper extends MessageWrapperBase<
  string,
  GetTokenMessageInput,
  GetTokenMessageResult
> {
  constructor(serverState: ServerState) {
    super(
      MessageTypes.GetTokenMessage,
      new GetTokenMessageInput(),
      new GetTokenMessageResult(),
      serverState,
      false
    );
  }
  process(
    req: express.Request,
    res: express.Response,
    serverState: ServerState
  ): void {
    const input = this.messageInput;
    if (
      !(input && input.name && input.clientpassword && input.serverpassword)
    ) {
      res.send(new ErrorMessageResult('invalid input'));
    } else {
      const createResult = serverState.applicationClients.createToken(
        input.name,
        input.serverpassword,
        input.clientpassword
      );

      this.messageResult.success = !!createResult;
      if (!this.messageResult.success) {
        this.messageResult.error = 'error';
      } else {
        this.messageResult.token = createResult;
      }
      res.send(this.messageResult);
    }
  }
}
