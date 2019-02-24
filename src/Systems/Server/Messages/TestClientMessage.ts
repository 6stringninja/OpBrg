import { MessageInputBase } from './Base/MessageInputBase';
import { MessageTypes } from './Base/MessageTypes';
import { MessageResultBase } from './Base/MessageResultBase';
import { MessageWrapperBase } from './Base/MessageWrapperBase';
import { ServerState } from '../ServerState';
import express = require('express');

export class TestClientMessageInput extends MessageInputBase {
  fail = false;
  throw = false;
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
    if (this.messageInput.throw) {
      throw new Error('throw=true');
    }

    this.messageResult.success = !this.messageInput.fail;
    res.send(this.messageResult);
    this.send(req, res, this.messageResult);
    // throw new Error('Method not implemented.');
  }
}
