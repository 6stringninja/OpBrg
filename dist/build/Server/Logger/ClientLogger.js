"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationTokenHelper_1 = require("../../Application/ApplicationTokenHelper");
const ApplicationFunctions_1 = require("../../Application/ApplicationFunctions");
class ClientLoggerMessage {
    constructor() {
        this.id = 0;
        this.timestamp = ApplicationFunctions_1.getTimestamp();
        this.name = '';
        this.success = false;
        this.noonce = '';
        this.typeOf = '';
    }
}
exports.ClientLoggerMessage = ClientLoggerMessage;
class ClientLogger {
    constructor(server) {
        this.server = server;
        this.loggerMessages = [];
        this._masterId = 1;
    }
    get masterId() {
        this._masterId++;
        return this._masterId;
    }
    log(req, res, msg) {
        if (this.server.config.clientLoggingEnabled) {
            if (req.body && req.body.typeOf) {
                const b = req.body;
                console.log(b.typeOf);
                if (!this.server.config.clientLoggingMessageWireTap.some(s => s === b.typeOf.toString() || s === 'all'))
                    return;
                if (!b.nonce)
                    b.nonce = ApplicationTokenHelper_1.ApplicationTokenHelper.generateIdentifier();
                const tn = b.token ? b.token.name : 'noname';
                const logMessage = new ClientLoggerMessage();
                logMessage.id = (this.masterId);
                logMessage.messageInput = b;
                logMessage.noonce = b.nonce;
                logMessage.name = tn;
                logMessage.typeOf = b.typeOf.toString();
                if (msg) {
                    logMessage.messageResult = msg;
                }
                console.log(logMessage);
                this.loggerMessages.push(logMessage);
                if (this.loggerMessages.length >
                    this.server.config.clientLoggingMaxRecords)
                    this.loggerMessages.shift();
            }
        }
    }
}
exports.ClientLogger = ClientLogger;
