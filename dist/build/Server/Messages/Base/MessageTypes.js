"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageTypes;
(function (MessageTypes) {
    MessageTypes["CreateClient"] = "create-client";
    MessageTypes["TestMessage"] = "test-message";
    MessageTypes["ErrorMessage"] = "error-message";
    MessageTypes["GetTokenMessage"] = "get-token";
    MessageTypes["IamAliveMessage"] = "i-am-alive";
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
function MessageTypesArray() {
    const map = [];
    for (const n in MessageTypes) {
        if (typeof MessageTypes[n] === 'string') {
            map.push({ id: MessageTypes[n], name: n });
        }
    }
    return map;
}
exports.MessageTypesArray = MessageTypesArray;
