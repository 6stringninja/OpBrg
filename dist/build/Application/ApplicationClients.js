"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ApplicationClients_1;
"use strict";
const ApplicationClientCreateResult_1 = require("./ApplicationClientCreateResult");
const ApplicationClient_1 = require("./ApplicationClient");
const tsyringe_1 = require("tsyringe");
const SerializeService_1 = require("../Services/SerializeService");
tsyringe_1.container.registerSingleton('ISerializerService<ApplicationClient[]>', SerializeService_1.ApplicationClientsSerializerJsonFileService);
let ApplicationClients = ApplicationClients_1 = class ApplicationClients {
    constructor(serializeService) {
        this.serializeService = serializeService;
        this.clients = [];
        this.load = () => {
            const result = this.serializeService.deserialize();
            if (result.success && !!result.result) {
                this.clients = result.result;
            }
            return result.success;
        };
        this.save = () => this.serializeService.serialize(this.clients).success;
        this.createClient = (name, serverpassword, clientpassword) => this.isValidClientCredentialIsValid(name, serverpassword, clientpassword)
            ? this.validatedApplicationClientCreateResult(name, clientpassword)
            : ApplicationClientCreateResult_1.ApplicationClientCreateResult.Error;
        this.isValidClientCredentialIsValid = (name, serverpassword, clientpassword) => !!(this.serverTokens &&
            this.serverTokens.isValidServerPassword(serverpassword) &&
            !!clientpassword &&
            !!name);
        this.doesClientNameExist = (name) => this.clients.some(s => s.name === name);
        this.addClient = (name, clientpassword) => this.clients.push(new ApplicationClient_1.ApplicationClient(name, clientpassword));
        this.validatedApplicationClientCreateResult = (name, clientpassword) => this.doesClientNameExist(name)
            ? ApplicationClientCreateResult_1.ApplicationClientCreateResult.NameUnavailable
            : this.addClientApplicationClientCreateResult(name, clientpassword);
        this.addClientApplicationClientCreateResult = (name, clientpassword) => !!this.addClient(name, clientpassword)
            ? ApplicationClientCreateResult_1.ApplicationClientCreateResult.Success
            : ApplicationClientCreateResult_1.ApplicationClientCreateResult.Error;
    }
    static create(serverTokens) {
        const appClients = tsyringe_1.container.resolve(ApplicationClients_1);
        appClients.serverTokens = serverTokens;
        return appClients;
    }
    isAuthorizedClient(name, password) {
        return !!(name &&
            password &&
            this.clients.some(s => s.name === name && s.password === password));
    }
};
ApplicationClients = ApplicationClients_1 = __decorate([
    tsyringe_1.autoInjectable(),
    __param(0, tsyringe_1.inject('ISerializerService<ApplicationClient[]>')),
    __metadata("design:paramtypes", [Object])
], ApplicationClients);
exports.ApplicationClients = ApplicationClients;
