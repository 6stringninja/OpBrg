import { ServerState } from '../ServerState';
import { MessageInputBase } from './Base/MessageInputBase';
import { MessageResultBase } from './Base/MessageResultBase';
import { MessageWrapperBase } from './Base/MessageWrapperBase';
export enum MessageTypes {
  CreateClient = 'Create Client',
  TestMessage = 'Test Message',
  ErrorMessage = 'Error Message',
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
      serverState
    );
  }
  process(
    req: Express.Request,
    res: Express.Response,
    serverState: ServerState
  ): void {}
}
