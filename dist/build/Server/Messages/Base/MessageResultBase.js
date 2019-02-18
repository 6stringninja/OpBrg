"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageResultBase {
    constructor(typeOf) {
        this.typeOf = typeOf;
        this.success = false;
        this.timestamp = new Date().getTime();
    }
}
exports.MessageResultBase = MessageResultBase;
