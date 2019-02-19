"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageInputBase_1 = require("./Base/MessageInputBase");
const MessageTypes_1 = require("./Base/MessageTypes");
const MessageResultBase_1 = require("./Base/MessageResultBase");
const MessageWrapperBase_1 = require("./Base/MessageWrapperBase");
class TestClientMessageInput extends MessageInputBase_1.MessageInputBase {
    constructor() {
        super(MessageTypes_1.MessageTypes.TestMessage);
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
        super('test', new TestClientMessageInput(), new TestClientMessageResult(), serverState, true);
    }
    process(req, res, serverState) {
    }
}
exports.TestClientMessageWrapper = TestClientMessageWrapper;
