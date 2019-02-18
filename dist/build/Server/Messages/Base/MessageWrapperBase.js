"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageWrapperBase {
    constructor(name = '', messageInput, messageResult) {
        this.name = name;
        this.messageInput = messageInput;
        this.messageResult = messageResult;
        if (!this.name)
            throw new Error('name required');
        if (this.messageInput.typeOf !== messageResult.typeOf)
            throw new Error('input and result must match');
        this.typeOf = messageInput.typeOf;
    }
    newInput() {
        return Object.assign({}, this.messageInput);
    }
    newResult() {
        return Object.assign({}, this.messageResult);
    }
}
exports.MessageWrapperBase = MessageWrapperBase;
