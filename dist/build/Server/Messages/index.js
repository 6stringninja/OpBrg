"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateClientMessage_1 = require("./CreateClientMessage");
const GetTokenMessage_1 = require("./GetTokenMessage");
const IamAlliveMessage_1 = require("./IamAlliveMessage");
function Messages(serverState) {
    return !!serverState ? [
        new CreateClientMessage_1.CreateClientMessageWrapper(serverState),
        new GetTokenMessage_1.GetTokenMessageWrapper(serverState),
        new IamAlliveMessage_1.IamAliveMessageWrapper(serverState)
    ] : [];
}
exports.Messages = Messages;
