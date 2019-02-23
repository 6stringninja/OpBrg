import { Client } from '../Client';
import {
  MessageResultBase,
  IMessageResultBase
} from '../../Server/Messages/Base/MessageResultBase';
import { IamAliveMessageInput } from '../../Server/Messages/IamAlliveMessage';
import { MessageInputBase } from '../../Server/Messages/Base/MessageInputBase';
import { IClientRequestBase } from './Base/ClientRequestBase';
import { ErrorMessageResult } from '../../Server/Messages/Base/MessageWrapperBase';
import {
  TestClientMessageInput,
  TestClientMessageResult
} from '../../Server/Messages/TestClientMessage';
import { TestClientRequest } from '../Requests/TestClientRequest';
import { CreateClientMessageInput } from '../../Server/Messages/CreateClientMessage';
import { CreateClientRequest } from './CreateClientRequest';
import { GetTokenMessageInput } from '../../Server/Messages/GetTokenMessage';
import { GetTokenRequest } from './GetTokenRequest';
import { IamAliveRequest } from './IamAliveRequest';
export class Requests {
  constructor(public client: Client) {}
  async Test(input: TestClientMessageInput): Promise<IMessageResultBase> {
    return await this.post(new TestClientRequest(this.client), input);
  }
  async CreateClient(
    input: CreateClientMessageInput
  ): Promise<IMessageResultBase> {
    return await this.post(new CreateClientRequest(this.client), input);
  }
  async GetToken(input: GetTokenMessageInput): Promise<IMessageResultBase> {
    return await this.post(new GetTokenRequest(this.client), input);
  }
  async IamAlive(input: IamAliveMessageInput): Promise<IMessageResultBase> {
    return await this.post(new IamAliveRequest(this.client), input);
  }
  private getStateData = () => {
    if (this.client.clientState && this.client.clientState.stateData) {
      return this.client.clientState.stateData;
    }
    return undefined;
  };
  private getState = () => {
    if (this.client.clientState && this.client.clientState.stateData) {
      return this.client.clientState;
    }
    return undefined;
  };
  private async post<TResult extends MessageResultBase>(
    message: IClientRequestBase<TResult>,
    input: MessageInputBase
  ): Promise<IMessageResultBase | TResult> {
    try {
      if (
        !input.token &&
        this.client.clientState &&
        this.client.clientState.stateData
      )
        input.token = this.client.clientState.stateData.token;
      message.messageInput = input;
      const result = await message.post();

      message.messageResult = Object.assign(message.messageResult, result);

      this.client.updatetoken(message);

      return result;
    } catch (error) {
      return new ErrorMessageResult(error);
    }
  }
}
