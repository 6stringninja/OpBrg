"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageInputBase_1 = require("./Base/MessageInputBase");
const MessageResultBase_1 = require("./Base/MessageResultBase");
const MessageWrapperBase_1 = require("./Base/MessageWrapperBase");
const MessageTypes_1 = require("./Base/MessageTypes");
class GetTokenMessageInput extends MessageInputBase_1.MessageInputBase {
    constructor(name = '', clientpassword = '', serverpassword = '') {
        super(MessageTypes_1.MessageTypes.GetTokenMessage);
        this.name = name;
        this.clientpassword = clientpassword;
        this.serverpassword = serverpassword;
    }
}
exports.GetTokenMessageInput = GetTokenMessageInput;
class GetTokenMessageResult extends MessageResultBase_1.MessageResultBase {
    constructor(success = false) {
        super(MessageTypes_1.MessageTypes.GetTokenMessage);
        this.success = success;
    }
}
exports.GetTokenMessageResult = GetTokenMessageResult;
class GetTokenMessageWrapper extends MessageWrapperBase_1.MessageWrapperBase {
    constructor(serverState) {
        super(MessageTypes_1.MessageTypes.GetTokenMessage, new GetTokenMessageInput(), new GetTokenMessageResult(), serverState, false);
    }
    process(req, res, serverState) {
        const input = this.messageInput;
        if (!(input && input.name && input.clientpassword && input.serverpassword)) {
            res.send(new MessageWrapperBase_1.ErrorMessageResult('invalid input'));
        }
        else {
            const createResult = serverState.applicationClients.createToken(input.name, input.serverpassword, input.clientpassword);
            this.messageResult.success = !!createResult;
            if (!this.messageResult.success) {
                this.messageResult.error = 'error';
            }
            else {
                this.messageResult.token = createResult;
            }
            res.send(this.messageResult);
        }
    }
}
exports.GetTokenMessageWrapper = GetTokenMessageWrapper;
