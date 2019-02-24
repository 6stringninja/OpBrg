"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageInputBase_1 = require("./Base/MessageInputBase");
const MessageResultBase_1 = require("./Base/MessageResultBase");
const MessageWrapperBase_1 = require("./Base/MessageWrapperBase");
const MessageTypes_1 = require("./Base/MessageTypes");
class IamAliveMessageInput extends MessageInputBase_1.MessageInputBase {
    constructor(sentat = new Date().getTime()) {
        super(MessageTypes_1.MessageTypes.IamAliveMessage);
        this.sentat = sentat;
    }
}
exports.IamAliveMessageInput = IamAliveMessageInput;
class IamAliveMessageResult extends MessageResultBase_1.MessageResultBase {
    constructor(success = false, sentat = new Date().getTime()) {
        super(MessageTypes_1.MessageTypes.IamAliveMessage);
        this.sentat = sentat;
        this.success = success;
    }
}
exports.IamAliveMessageResult = IamAliveMessageResult;
class IamAliveMessageWrapper extends MessageWrapperBase_1.MessageWrapperBase {
    constructor(serverState) {
        super(MessageTypes_1.MessageTypes.IamAliveMessage, new IamAliveMessageInput(), new IamAliveMessageResult(), serverState);
    }
    process(req, res, serverState) {
        const input = this.messageInput;
        if (!(input && input.sentat)) {
            res.send(new MessageWrapperBase_1.ErrorMessageResult('invalid input'));
        }
        else {
            this.messageResult.sentat = new Date().getTime();
            this.messageResult.success = true;
            this.send(req, res, this.messageResult);
        }
    }
}
exports.IamAliveMessageWrapper = IamAliveMessageWrapper;
