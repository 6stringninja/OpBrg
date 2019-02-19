import { ServerState } from '../ServerState';
import { MessageInputBase } from './Base/MessageInputBase';
import { MessageResultBase } from './Base/MessageResultBase';
import {
  MessageWrapperBase,
  ErrorMessageResult
} from './Base/MessageWrapperBase';
import express = require('express');
import { ApplicationClientCreateResult } from '../../Application/ApplicationClientCreateResult';
export enum MessageTypes {
  CreateClient = 'Create Client',
  TestMessage = 'Test Message',
  ErrorMessage = 'Error Message',
  GetTokenMessage = 'Get Token Message',
}
export class CreateClientMessageInput extends MessageInputBase {
  constructor(
    public name = '',
    public clientpassword = '',
    public serverpassword = ''
  ) {
    super(MessageTypes.CreateClient);
  }
}
export class CreateClientMessageResult extends MessageResultBase<string> {
  constructor(success = false) {
    super(MessageTypes.CreateClient);
    this.success = success;
  }
}
export class CreateClientMessageWrapper extends MessageWrapperBase<
  string,
  CreateClientMessageInput,
  CreateClientMessageResult
> {
  constructor(serverState: ServerState) {
    super(
      'createclient',
      new CreateClientMessageInput(),
      new CreateClientMessageResult(),
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
      const createResult = serverState.applicationClients.createClient(
        input.name,
        input.serverpassword,
        input.clientpassword
      );
      this.messageResult.success =
        createResult === ApplicationClientCreateResult.Success;
      if (!this.messageResult.success) {
        this.messageResult.error = createResult.toString();
      } else {
        this.messageResult.token = serverState.authenticateNewToken(
          input.name,
          input.serverpassword
        );
      }
      res.send(this.messageResult);
    }
  }
}
