import { ApplicationToken } from '../../../Application/ApplicationToken';
import { MessageTypes } from './MessageTypes';
export interface IMessageResultBase {
  success: boolean;
  token: ApplicationToken | undefined;
  timestamp: number;
  error: string | undefined;
  typeOf: MessageTypes;
}
export abstract class MessageResultBase  implements IMessageResultBase {
  token: ApplicationToken | undefined;
  nonce: string | undefined;

  success = false;
  timestamp = new Date().getTime();
  constructor(public typeOf: MessageTypes) {}
  error: string | undefined;
}
