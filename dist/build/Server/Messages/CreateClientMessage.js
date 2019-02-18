"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageInputBase_1 = require("./Base/MessageInputBase");
const MessageResultBase_1 = require("./Base/MessageResultBase");
const MessageWrapperBase_1 = require("./Base/MessageWrapperBase");
var MessageTypes;
(function (MessageTypes) {
    MessageTypes["CreateClient"] = "Create Client";
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
class CreateClientMessageInput extends MessageInputBase_1.MessageInputBase {
    constructor(name = '', clientpassword = '', serverpassword = '') {
        super(MessageTypes.CreateClient);
        this.name = name;
        this.clientpassword = clientpassword;
        this.serverpassword = serverpassword;
    }
}
exports.CreateClientMessageInput = CreateClientMessageInput;
class CreateClientMessageResult extends MessageResultBase_1.MessageResultBase {
    constructor(success = false) {
        super(MessageTypes.CreateClient);
        this.success = success;
    }
}
exports.CreateClientMessageResult = CreateClientMessageResult;
class CreateClientMessageWrapper extends MessageWrapperBase_1.MessageWrapperBase {
    constructor() {
        super('createclient', new CreateClientMessageInput(), new CreateClientMessageResult());
    }
    process(req, res, serverState) { }
}
exports.CreateClientMessageWrapper = CreateClientMessageWrapper;
