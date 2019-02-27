"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientRequestBase_1 = require("./Base/ClientRequestBase");
const IamAlliveMessage_1 = require("../../Server/Messages/IamAlliveMessage");
class IamAliveRequest extends ClientRequestBase_1.ClientRequestBase {
    constructor(client) {
        super(new IamAlliveMessage_1.IamAliveMessageInput(), new IamAlliveMessage_1.IamAliveMessageResult(), client);
    }
}
exports.IamAliveRequest = IamAliveRequest;
