import { ServerState } from '../../ServerState';
import { MessageInputBase } from './MessageInputBase';
import { MessageResultBase } from './MessageResultBase';
import { MessageTypes } from './MessageTypes';
import express = require('express');
export interface IMessageWrapper {
  process(
    req: Express.Request,
    res: Express.Response,
    serverState: ServerState
  ): void;
  express(req: Express.Request, res: Express.Response): void;
  typeOf: MessageTypes;
  name: string;
}
export class ErrorMessageResult extends MessageResultBase<string> {
  constructor(msg = '') {
    super(MessageTypes.ErrorMessage);
    this.error = msg || this.error;
    this.success = false;
  }
}
export abstract class MessageWrapperBase<
  T,
  TInput extends MessageInputBase,
  TResult extends MessageResultBase<T>
> implements IMessageWrapper {
  express(req: express.Request, res: express.Response): void {
    this.process(req, res, this.serverState);
  }
  typeOf: MessageTypes;
  authenticated = false;
  processExpress(req: express.Request, res: express.Response): void {
    try {
      this.messageInput = JSON.parse(req.body) as TInput;
      if (!this.validateToken()) {
        res.send(new ErrorMessageResult('Invalid Token'));

        return;
      }
      this.authenticated = true;
      this.serverState.addOrUpdateToken(this.messageResult.token);
      this.process(req, res, this.serverState);
    } catch (error) {
      console.log('callprocessExpress errored');
      res.send(new ErrorMessageResult(error));
    }
  }
  validateToken() {
    // console.log({ tokens: this.serverState.tokens, token: this.messageInput.token })

    if (!this.secured) return true;
    if (!this.messageInput || !this.messageInput.token) return false;

    const tokenResult = this.serverState.validateToken(this.messageInput.token);
    this.messageResult.success = tokenResult.success;
    this.messageResult.token = tokenResult.token;
    if (!this.messageResult.success) this.messageResult.error = 'Invalid Token';

    return this.messageResult.success;
  }
  constructor(
    public name: MessageTypes,
    public messageInput: TInput,
    public messageResult: TResult,
    public serverState: ServerState,
    public secured = true
  ) {
    if (!this.name) throw new Error('name required');
    if (
      !(
        this.messageInput.typeOf == messageResult.typeOf &&
        this.name === messageInput.typeOf
      )
    )
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
    req: express.Request,
    res: express.Response,
    serverState: ServerState
  ): void;
}
