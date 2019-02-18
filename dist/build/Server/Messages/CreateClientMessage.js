"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageTypes;
(function (MessageTypes) {
    MessageTypes["CreateClient"] = "Create Client";
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
class MessageInputBase {
    constructor(typeOf) {
        this.typeOf = typeOf;
    }
}
exports.MessageInputBase = MessageInputBase;
class MessageResultBase {
    constructor(typeOf) {
        this.typeOf = typeOf;
        this.success = false;
        this.timestamp = new Date().getTime();
    }
}
exports.MessageResultBase = MessageResultBase;
class CreateClientMessageInput extends MessageInputBase {
    constructor(name = '', clientpassword = '', serverpassword = '') {
        super(MessageTypes.CreateClient);
        this.name = name;
        this.clientpassword = clientpassword;
        this.serverpassword = serverpassword;
    }
}
exports.CreateClientMessageInput = CreateClientMessageInput;
class CreateClientMessageResult extends MessageResultBase {
    constructor(success = false) {
        super(MessageTypes.CreateClient);
        this.success = success;
    }
}
exports.CreateClientMessageResult = CreateClientMessageResult;
