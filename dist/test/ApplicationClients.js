"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateApplicationClientResult_1 = require("./CreateApplicationClientResult");
const ApplicationClient_1 = require("./ApplicationClient");
class ApplicationClients {
    constructor(serverTokens) {
        this.serverTokens = serverTokens;
        this.clients = [];
        this.createClient = (name, serverpassword, clientpassword) => this.isValidClientCredentialIsValid(name, serverpassword, clientpassword)
            ? this.validatedCreateApplicationClientResult(name, clientpassword)
            : CreateApplicationClientResult_1.CreateApplicationClientResult.Error;
        this.isValidClientCredentialIsValid = (name, serverpassword, clientpassword) => this.serverTokens.isValidServerPassword(serverpassword) &&
            !!clientpassword &&
            !!name;
        this.doesClientNameExist = (name) => this.clients.some(s => s.name === name);
        this.addClient = (name, clientpassword) => this.clients.push(new ApplicationClient_1.ApplicationClient(name, clientpassword));
        this.validatedCreateApplicationClientResult = (name, clientpassword) => this.doesClientNameExist(name)
            ? CreateApplicationClientResult_1.CreateApplicationClientResult.NameUnavailable
            : this.addClientCreateApplicationClientResult(name, clientpassword);
        this.addClientCreateApplicationClientResult = (name, clientpassword) => !!this.addClient(name, clientpassword)
            ? CreateApplicationClientResult_1.CreateApplicationClientResult.Success
            : CreateApplicationClientResult_1.CreateApplicationClientResult.Error;
    }
    isAuthorizedClient(name, password) {
        return (name &&
            password &&
            this.clients.some(s => s.name === name && s.password === password));
    }
}
exports.ApplicationClients = ApplicationClients;
