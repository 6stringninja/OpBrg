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
        this.authenticateNewToken = (name, password) => name && this.isValidServerPassword(password)
            ? this.addOrUpdateToken(ApplicationTokenHelper_1.ApplicationTokenHelper.createToken(name))
            : undefined;
        this.isValidToken = (token) => token &&
            token.name &&
            token.id &&
            token.issued &&
            token.issued > new Date().getTime() &&
            this.tokens.some(s => s.name === token.name && s.id === token.id && s.issued === token.issued);
        this.filterOutExpiredTokens = () => this.tokens.filter(f => f.issued < new Date().getTime());
        this.updateSoonToExpireToken = (token) => ApplicationTokenHelper_1.ApplicationTokenHelper.isAboutToExpire(token)
            ? this.addOrUpdateToken(ApplicationTokenHelper_1.ApplicationTokenHelper.setTokenIssuedAndId(token))
            : token;
        this.isEmptyToken = (token) => !(token && token.name);
        this.findTokenIndexByName = (token) => this.tokens.findIndex(f => f.name === token.name);
        this.applicationClients = new ApplicationClients_1.ApplicationClients(this);
    }
    getToken(name) {
        return this.tokens.find(f => f.name == name);
    }
    addOrUpdateToken(token) {
        if (this.isEmptyToken(token))
            return token;
        const findTokenIndex = this.findTokenIndexByName(token);
        if (findTokenIndex > -1) {
            this.tokens[findTokenIndex] = token;
        }
        else {
            this.tokens.push(token);
        }
        return token.clone();
    }
    isValidServerPassword(password) {
        return password && this.password && this.password === password;
    }
    validateToken(token) {
        const isValidatedToken = this.isValidToken(token);
        return new ServerTokenValidateResult(isValidatedToken ? this.updateSoonToExpireToken(token) : token, isValidatedToken);
    }
    removeExpiredTokens() {
        const countPriorToFilter = this.tokens.length;
        this.tokens = this.filterOutExpiredTokens();
        return countPriorToFilter !== this.tokens.length;
    }
}
exports.ServerTokens = ServerTokens;
