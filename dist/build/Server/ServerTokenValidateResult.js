"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerTokenValidateResult {
    constructor(token, success = false) {
        this.token = token;
        this.success = success;
    }
}
exports.ServerTokenValidateResult = ServerTokenValidateResult;
