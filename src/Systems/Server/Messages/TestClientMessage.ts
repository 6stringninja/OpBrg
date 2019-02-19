import { MessageInputBase } from './Base/MessageInputBase';
import { MessageTypes } from './CreateClientMessage';
import { MessageResultBase } from './Base/MessageResultBase';
import { MessageWrapperBase } from './Base/MessageWrapperBase';
import { ServerState } from '../ServerState';

export class TestClientMessageInput extends MessageInputBase {
  constructor() {
    super(MessageTypes.TestMessage);
  }
}
export class TestClientMessageResult extends MessageResultBase<string> {
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
      'test',
      new TestClientMessageInput(),
      new TestClientMessageResult(),
      serverState,
      true
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
