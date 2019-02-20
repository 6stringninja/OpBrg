"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageResultBase_1 = require("./MessageResultBase");
const MessageTypes_1 = require("./MessageTypes");
class ErrorMessageResult extends MessageResultBase_1.MessageResultBase {
    constructor(msg = '') {
        super(MessageTypes_1.MessageTypes.ErrorMessage);
        this.error = msg || this.error;
        this.success = false;
    }
}
exports.ErrorMessageResult = ErrorMessageResult;
class MessageWrapperBase {
    constructor(name, messageInput, messageResult, serverState, secured = true) {
        this.name = name;
        this.messageInput = messageInput;
        this.messageResult = messageResult;
        this.serverState = serverState;
        this.secured = secured;
        this.authenticated = false;
        if (!this.name)
            throw new Error('name required');
        if (!(this.messageInput.typeOf == messageResult.typeOf &&
            this.name === messageInput.typeOf))
            throw new Error('input and result must match');
        this.typeOf = messageInput.typeOf;
    }
    express(req, res) {
        this.process(req, res, this.serverState);
    }
    processExpress(req, res) {
        try {
            try {
                this.messageInput = JSON.parse(req.body);
            }
            catch (error) {
                this.messageInput = req.body;
            }
            if (!this.validateToken()) {
                res.send(new ErrorMessageResult('Invalid Token'));
                return;
            }
            this.authenticated = true;
            this.serverState.addOrUpdateToken(this.messageResult.token);
            this.process(req, res, this.serverState);
        }
        catch (error) {
            console.log(error);
            console.log('callprocessExpress errored');
            res.send(new ErrorMessageResult(error));
        }
    }
    validateToken() {
        if (!this.secured)
            return true;
        if (!this.messageInput || !this.messageInput.token)
            return false;
        const tokenResult = this.serverState.validateToken(this.messageInput.token);
        this.messageResult.success = tokenResult.success;
        this.messageResult.token = tokenResult.token;
        if (!this.messageResult.success)
            this.messageResult.error = 'Invalid Token';
        return this.messageResult.success;
    }
    newInput() {
        return Object.assign({}, this.messageInput);
    }
    newResult() {
        return Object.assign({}, this.messageResult);
    }
}
exports.MessageWrapperBase = MessageWrapperBase;
