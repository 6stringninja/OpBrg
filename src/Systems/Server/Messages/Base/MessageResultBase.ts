import { ApplicationToken } from '../../../Application/ApplicationToken';
import { MessageTypes } from './MessageTypes';
export abstract class MessageResultBase<T> {
  token: ApplicationToken | undefined;
  nonce: string | undefined;
  result: T | undefined;
  success = false;
  timestamp = new Date().getTime();
  constructor(public typeOf: MessageTypes) { }
  error: string | undefined;
}
