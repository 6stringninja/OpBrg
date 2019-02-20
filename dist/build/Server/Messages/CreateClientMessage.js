"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageInputBase_1 = require("./Base/MessageInputBase");
const MessageResultBase_1 = require("./Base/MessageResultBase");
const MessageWrapperBase_1 = require("./Base/MessageWrapperBase");
const ApplicationClientCreateResult_1 = require("../../Application/ApplicationClientCreateResult");
const MessageTypes_1 = require("./Base/MessageTypes");
class CreateClientMessageInput extends MessageInputBase_1.MessageInputBase {
    constructor(name = '', clientpassword = '', serverpassword = '') {
        super(MessageTypes_1.MessageTypes.CreateClient);
        this.name = name;
        this.clientpassword = clientpassword;
        this.serverpassword = serverpassword;
    }
}
exports.CreateClientMessageInput = CreateClientMessageInput;
class CreateClientMessageResult extends MessageResultBase_1.MessageResultBase {
    constructor(success = false) {
        super(MessageTypes_1.MessageTypes.CreateClient);
        this.success = success;
    }
}
exports.CreateClientMessageResult = CreateClientMessageResult;
class CreateClientMessageWrapper extends MessageWrapperBase_1.MessageWrapperBase {
    constructor(serverState) {
        super(MessageTypes_1.MessageTypes.CreateClient, new CreateClientMessageInput(), new CreateClientMessageResult(), serverState, false);
    }
    process(req, res, serverState) {
        const input = this.messageInput;
        console.log({ messageInut: input });
        if (!(input && input.name && input.clientpassword && input.serverpassword)) {
            res.send(new MessageWrapperBase_1.ErrorMessageResult('invalid input'));
        }
        else {
            const createResult = serverState.applicationClients.createClient(input.name, input.serverpassword, input.clientpassword);
            console.log({ createResult: createResult });
            this.messageResult.success =
                createResult === ApplicationClientCreateResult_1.ApplicationClientCreateResult.Success;
            if (!this.messageResult.success) {
                this.messageResult.error = createResult.toString();
            }
            else {
                this.messageResult.token = serverState.authenticateNewToken(input.name, input.serverpassword);
            }
            res.send(this.messageResult);
        }
    }
}
exports.CreateClientMessageWrapper = CreateClientMessageWrapper;
