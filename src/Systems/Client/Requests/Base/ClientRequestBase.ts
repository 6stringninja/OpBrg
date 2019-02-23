import {
  MessageResultBase,
  IMessageResultBase
} from '../../../Server/Messages/Base/MessageResultBase';
import { MessageInputBase } from '../../../Server/Messages/Base/MessageInputBase';
import { MessageTypes } from '../../../Server/Messages/Base/MessageTypes';
import { Client } from '../../Client';
import request = require('request');
import { ErrorMessageResult } from '../../../Server/Messages/Base/MessageWrapperBase';
export interface IClientRequestBase<TResult extends MessageResultBase> {
  authenticated: boolean;
  messageResult: TResult;
  post(): Promise<IMessageResultBase>;
  apiUrl: string;
  messageInput: MessageInputBase;

}
export abstract class ClientRequestBase<
  TInput extends MessageInputBase,
  TResult extends MessageResultBase
> implements IClientRequestBase<TResult> {
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

  post(): Promise<IMessageResultBase> {
    const options = {
      url: this.apiUrl,
      method: 'POST',
      json: this.messageInput
    };
    return new Promise((resolve, reject) => {
      let rtrn: IMessageResultBase = this.messageResult;
      try {
        request.post(options, (error, resp, body) => {
          if (error) {

            this.messageResult.success = false;
            this.messageResult.error = error.toString();
            rtrn = this.messageResult;
            rtrn = new ErrorMessageResult(error.toString());
            resolve(rtrn);
          } else {
            try {
              rtrn = body as TResult;
              this.client.updatetoken(this);
            } catch (error) {
              rtrn = new ErrorMessageResult(error.toString());
            }

            resolve(rtrn);
          }
        });
      } catch (error) {
        rtrn = new ErrorMessageResult(error.toString());
        resolve(rtrn);
      }

    });
  }

  private getUrlPortPart = () =>
    this.client.config.port === 80
      ? ''
      : `:${this.client.config.port.toString()}`;
  private getApiUrl = (name: string) =>
    `http://${this.client.config.server}${this.getUrlPortPart()}/api/${name}`;
}
