import { MessageInputBase } from './Base/MessageInputBase';
import { MessageTypes } from './Base/MessageTypes';
import { MessageResultBase } from './Base/MessageResultBase';
import { MessageWrapperBase } from './Base/MessageWrapperBase';
import { ServerState } from '../ServerState';

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
    req: Express.Request,
    res: Express.Response,
    serverState: ServerState
  ): void {
   // throw new Error('Method not implemented.');
  }
}
