"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestClientMessage_1 = require("../../Server/Messages/TestClientMessage");
const ClientRequestBase_1 = require("./Base/ClientRequestBase");
class TestClientRequest extends ClientRequestBase_1.ClientRequestBase {
    constructor(client) {
        super(new TestClientMessage_1.TestClientMessageInput(), new TestClientMessage_1.TestClientMessageResult(), client);
    }
}
exports.TestClientRequest = TestClientRequest;
