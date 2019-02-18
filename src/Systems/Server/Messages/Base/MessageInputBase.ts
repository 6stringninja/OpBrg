import { ApplicationToken } from '../../../Application/ApplicationToken';
import { MessageTypes } from '../CreateClientMessage';
export abstract class MessageInputBase {
  token: ApplicationToken | undefined;
  nonce: string | undefined;
  constructor(public typeOf: MessageTypes) { }
}
