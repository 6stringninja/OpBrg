import { ApplicationToken } from '../../Application/ApplicationToken';
export enum MessageTypes {
  CreateClient = 'Create Client'
}
export abstract class MessageInputBase {
  token: ApplicationToken | undefined;
  nonce: string | undefined;
  constructor(public typeOf: MessageTypes) {}
}
export abstract class MessageResultBase<T> {
  token: ApplicationToken | undefined;
  nonce: string | undefined;
  result: T | undefined;
  success = false;
  timestamp = new Date().getTime();
  constructor(public typeOf: MessageTypes) {}
  error: string | undefined;
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
  constructor(success  = false) {
      super(MessageTypes.CreateClient);
      this.success = success;   
  }
}
