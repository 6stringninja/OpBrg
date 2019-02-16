"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationTokenHelper_1 = require("./ApplicationTokenHelper");
const ApplicationClients_1 = require("./ApplicationClients");
class ServerTokenValidateResult {
    constructor(token, success = false) {
        this.token = token;
        this.success = success;
    }
}
exports.ServerTokenValidateResult = ServerTokenValidateResult;
class ServerTokens {
    constructor(password = ApplicationTokenHelper_1.ApplicationTokenHelper.generateIdentifier()) {
        this.password = password;
        this.tokens = [];
        this.filterOutExpiredTokens = () => this.tokens.filter(f => f.issued < new Date().getTime());
        this.applicationClients = new ApplicationClients_1.ApplicationClients(this);
    }
    getToken(name) {
        return this.tokens.find(f => f.name == name);
    }
    addOrUpdateToken(oldToken) {
        const token = ApplicationTokenHelper_1.ApplicationTokenHelper.copyToken(oldToken);
        if (token && token.name) {
            if (this.getToken(token.name)) {
                this.tokens[this.tokens.findIndex(f => f.name === token.name)] = token;
            }
            else {
                this.tokens.push(token);
            }
        }
    }
    checkServerPassword(password) {
        return password && this.password && this.password === password;
    }
    authenticateNewToken(name, password) {
        if (name && this.checkServerPassword(password)) {
            const token = ApplicationTokenHelper_1.ApplicationTokenHelper.createToken(name);
            this.addOrUpdateToken(token);
            return token;
        }
        return undefined;
    }
    isValidToken(token) {
        return (token &&
            token.name &&
            token.id &&
            token.issued &&
            token.issued > new Date().getTime() &&
            this.tokens.some(s => s.name === token.name &&
                s.id === token.id &&
                s.issued === token.issued));
    }
    updateTokenIfExpiringSoon(token) {
        if (ApplicationTokenHelper_1.ApplicationTokenHelper.isAboutToExpire(token)) {
            token = ApplicationTokenHelper_1.ApplicationTokenHelper.setTokenIssuedAndId(token);
            this.addOrUpdateToken(token);
        }
        return token;
    }
    validateToken(token) {
        const result = new ServerTokenValidateResult(token, this.isValidToken(token));
        if (result.success) {
            result.token = this.updateTokenIfExpiringSoon(result.token);
        }
        return result;
    }
    removeExpiredTokens() {
        const currentCount = this.tokens.length;
        this.tokens = this.filterOutExpiredTokens();
        return currentCount !== this.tokens.length;
    }
}
exports.ServerTokens = ServerTokens;
