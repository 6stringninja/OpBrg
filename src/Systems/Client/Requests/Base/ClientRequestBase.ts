import {
  MessageResultBase,
  IMessageResultBase
} from '../../../Server/Messages/Base/MessageResultBase';
import { MessageInputBase } from '../../../Server/Messages/Base/MessageInputBase';
import { MessageTypes } from '../../../Server/Messages/Base/MessageTypes';
import { ClientState } from '../../ClientState';
import { Client } from '../../Client';
import request = require('request');
import { ErrorMessageResult } from '../../../Server/Messages/Base/MessageWrapperBase';
export interface IClassRequestBase<TResult extends MessageResultBase> {
  authenticated: boolean;
  messageResult: TResult;
}
export abstract class ClientRequestBase<
  TInput extends MessageInputBase,
  TResult extends MessageResultBase
> implements IClassRequestBase<TResult> {
  typeOf: MessageTypes;
  routeName: string;
  constructor(
    public messageInput: TInput,
    public messageResult: TResult,
    public client: Client,
    public authenticated = true
  ) {
    if (this.messageInput.typeOf !== messageResult.typeOf)
      throw new Error('ClientRequestBase typeOf does not match');
    this.typeOf = this.messageInput.typeOf;
    this.routeName = this.typeOf.toString();
  }

  public get apiUrl() {
    return this.getApiUrl(this.routeName);
  }
  public async post() {
    let rtrn: ErrorMessageResult | TResult = this.messageResult;

    await request.post(
      this.apiUrl,
      {
        json: this.messageInput
      },
      (error, res, body) => {
        if (error) {
          console.error(error);
          this.messageResult.success = false;
          this.messageResult.error = error.toString();
          rtrn = this.messageResult;
        } else {
          try {
            rtrn = body as TResult;
            this.client.updatetoken(this);
          } catch (error) {
            rtrn = new ErrorMessageResult(error.toString());
          }
        }
      }
    );
    return this.messageResult;
  }
  private getUrlPortPart = () =>
    this.client.config.port === 80
      ? ''
      : `:${this.client.config.port.toString()}`;
  private getApiUrl = (name: string) =>
    `http://${this.client.config.server}${this.getUrlPortPart()}/${name}`;
}
