import { ServerState } from '../../ServerState';
import { MessageInputBase } from './MessageInputBase';
import { MessageResultBase } from './MessageResultBase';
import { MessageTypes } from '../CreateClientMessage';
export interface IMessageWrapper {
  process(
    req: Express.Request,
    res: Express.Response,
    serverState: ServerState
  ): void;
  typeOf: MessageTypes;
  name: string;
}
export abstract class MessageWrapperBase< T,  TInput extends MessageInputBase,  TResult extends MessageResultBase<T>> 
  implements IMessageWrapper {
  typeOf: MessageTypes;

  constructor(
    public name = '',
    protected messageInput: TInput,
    protected messageResult: TResult
  ) {
    if (!this.name) throw new Error('name required');
    if (this.messageInput.typeOf !== messageResult.typeOf)
      throw new Error('input and result must match');
    this.typeOf = messageInput.typeOf;
  }
  newInput(): TInput {
    return Object.assign({}, this.messageInput) as TInput;
  }
  newResult(): TResult {
    return Object.assign({}, this.messageResult) as TResult;
  }
  abstract process(
    req: Express.Request,
    res: Express.Response,
    serverState: ServerState
  ): void;
}
