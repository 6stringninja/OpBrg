"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageInputBase_1 = require("./Base/MessageInputBase");
const MessageTypes_1 = require("./Base/MessageTypes");
const MessageResultBase_1 = require("./Base/MessageResultBase");
const MessageWrapperBase_1 = require("./Base/MessageWrapperBase");
class TestClientMessageInput extends MessageInputBase_1.MessageInputBase {
    constructor() {
        super(MessageTypes_1.MessageTypes.TestMessage);
        this.fail = false;
        this.throw = false;
    }
}
exports.TestClientMessageInput = TestClientMessageInput;
class TestClientMessageResult extends MessageResultBase_1.MessageResultBase {
    constructor() {
        super(MessageTypes_1.MessageTypes.TestMessage);
    }
}
exports.TestClientMessageResult = TestClientMessageResult;
class TestClientMessageWrapper extends MessageWrapperBase_1.MessageWrapperBase {
    constructor(serverState) {
        super(MessageTypes_1.MessageTypes.TestMessage, new TestClientMessageInput(), new TestClientMessageResult(), serverState, false);
    }
    process(req, res, serverState) {
        if (this.messageInput.throw) {
            throw new Error('throw=true');
        }
        this.messageResult.success = !this.messageInput.fail;
        res.send(this.messageResult);
        this.send(req, res, this.messageResult);
    }
}
exports.TestClientMessageWrapper = TestClientMessageWrapper;
