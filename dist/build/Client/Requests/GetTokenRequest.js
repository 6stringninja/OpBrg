"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientRequestBase_1 = require("./Base/ClientRequestBase");
const GetTokenMessage_1 = require("../../Server/Messages/GetTokenMessage");
class GetTokenRequest extends ClientRequestBase_1.ClientRequestBase {
    constructor(client) {
        super(new GetTokenMessage_1.GetTokenMessageInput(), new GetTokenMessage_1.GetTokenMessageResult(), client);
    }
}
exports.GetTokenRequest = GetTokenRequest;
