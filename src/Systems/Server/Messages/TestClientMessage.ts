import { MessageInputBase } from './Base/MessageInputBase';
import { MessageTypes } from './Base/MessageTypes';
import { MessageResultBase } from './Base/MessageResultBase';
import { MessageWrapperBase } from './Base/MessageWrapperBase';
import { ServerState } from '../ServerState';
import express = require('express');

export class TestClientMessageInput extends MessageInputBase {
  constructor() {
    super(MessageTypes.TestMessage);
  }
}
export class TestClientMessageResult extends MessageResultBase {
  constructor() {
    super(MessageTypes.TestMessage);
  }
}
export class TestClientMessageWrapper extends MessageWrapperBase<
  string,
  TestClientMessageInput,
  TestClientMessageResult
> {
  constructor(serverState: ServerState) {
    super(
      MessageTypes.TestMessage,
      new TestClientMessageInput(),
      new TestClientMessageResult(),
      serverState,
      false
    );
  }
  process(
    req: express.Request,
    res: express.Response,
    serverState: ServerState
  ): void {

    this.messageResult.success = true;
    res.send(this.messageResult);
   // throw new Error('Method not implemented.');
  }
}
