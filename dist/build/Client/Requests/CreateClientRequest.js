"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientRequestBase_1 = require("./Base/ClientRequestBase");
const CreateClientMessage_1 = require("../../Server/Messages/CreateClientMessage");
class CreateClientRequest extends ClientRequestBase_1.ClientRequestBase {
    constructor(client) {
        super(new CreateClientMessage_1.CreateClientMessageInput(), new CreateClientMessage_1.CreateClientMessageResult(), client);
    }
}
exports.CreateClientRequest = CreateClientRequest;
