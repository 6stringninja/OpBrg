"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateApplicationClientResult_1 = require("./CreateApplicationClientResult");
const ApplicationClient_1 = require("./ApplicationClient");
class ApplicationClients {
    constructor(serverTokens) {
        this.serverTokens = serverTokens;
        this.clients = [];
        this.clientCredentialIsValid = (name, serverpassword, clientpassword) => this.serverTokens.checkServerPassword(serverpassword) &&
            !!clientpassword &&
            !!name;
        this.doesClientNameExist = (name) => this.clients.some(s => s.name === name);
        this.addClient = (name, clientpassword) => this.clients.push(new ApplicationClient_1.ApplicationClient(name, clientpassword));
    }
    createClient(name, serverpassword, clientpassword) {
        if (this.clientCredentialIsValid(name, serverpassword, clientpassword)) {
            if (this.doesClientNameExist(name)) {
                return CreateApplicationClientResult_1.CreateApplicationClientResult.NameUnavailable;
            }
            this.addClient(name, clientpassword);
            return CreateApplicationClientResult_1.CreateApplicationClientResult.Success;
        }
        return CreateApplicationClientResult_1.CreateApplicationClientResult.Error;
    }
    authorizeClient(name, password) {
        return (name &&
            password &&
            this.clients.some(s => s.name === name && s.password === password));
    }
}
exports.ApplicationClients = ApplicationClients;
