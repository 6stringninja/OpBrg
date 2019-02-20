"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateClientMessage_1 = require("./CreateClientMessage");
const GetTokenMessage_1 = require("./GetTokenMessage");
const IamAlliveMessage_1 = require("./IamAlliveMessage");
const TestClientMessage_1 = require("./TestClientMessage");
function Messages(serverState) {
    return !!serverState ? [
        new CreateClientMessage_1.CreateClientMessageWrapper(serverState),
        new GetTokenMessage_1.GetTokenMessageWrapper(serverState),
        new IamAlliveMessage_1.IamAliveMessageWrapper(serverState),
        new TestClientMessage_1.TestClientMessageWrapper(serverState),
    ] : [];
}
exports.Messages = Messages;
