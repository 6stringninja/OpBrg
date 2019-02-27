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
var ServerState_1;
"use strict";
const ApplicationTokenHelper_1 = require("../Application/ApplicationTokenHelper");
const ApplicationClients_1 = require("../Application/ApplicationClients");
const util_1 = require("util");
const ServerTokenValidateResult_1 = require("./ServerTokenValidateResult");
const tsyringe_1 = require("tsyringe");
const SerializeService_1 = require("../Services/SerializeService");
tsyringe_1.container.registerSingleton('ISerializerService<ApplicationClient[]>', SerializeService_1.ApplicationClientsSerializerJsonFileService);
tsyringe_1.container.register('ISerializerService<ApplicationToken[]>', {
    useClass: SerializeService_1.ApplicationTokensSerializerJsonFileService
});
let ServerState = ServerState_1 = class ServerState {
    constructor(serializeTokensService) {
        this.serializeTokensService = serializeTokensService;
        this.tokens = [];
        this.password = ApplicationTokenHelper_1.ApplicationTokenHelper.generateIdentifier();
        this.authenticateNewClientToken = async (name, password) => {
            if (util_1.isUndefined(this.applicationClients))
                return;
            const token = name && this.applicationClients.isAuthorizedClient(name, password)
                ? await this.addOrUpdateToken(ApplicationTokenHelper_1.ApplicationTokenHelper.createToken(name))
                : undefined;
            return token;
        };
        this.authenticateNewToken = async (name, password) => name && await this.isValidServerPassword(password)
            ? await this.addOrUpdateToken(ApplicationTokenHelper_1.ApplicationTokenHelper.createToken(name))
            : undefined;
        this.isValidToken = (token) => {
            let tokenRequired = token &&
                token.name &&
                token.id &&
                token.issued &&
                token.issued > new Date().getTime();
            tokenRequired =
                tokenRequired &&
                    this.tokens.some(s => s.name === token.name &&
                        s.id === token.id &&
                        s.issued === token.issued);
            return tokenRequired;
        };
        this.filterOutExpiredTokens = () => this.tokens.filter(f => f.issued < new Date().getTime());
        this.updateSoonToExpireToken = async (token) => ApplicationTokenHelper_1.ApplicationTokenHelper.isAboutToExpire(token)
            ? await this.addOrUpdateToken(ApplicationTokenHelper_1.ApplicationTokenHelper.setTokenIssuedAndId(token))
            : token;
        this.isEmptyToken = (token) => !(token && token.name);
        this.findTokenIndexByName = (token) => this.tokens.findIndex(f => f.name === token.name);
        this.serializeTokensService.deserialize().then((result) => {
            if (result.success && result.result) {
                this.tokens = result.result;
            }
            this.applicationClients = ApplicationClients_1.ApplicationClients.create(this);
        });
    }
    static create(password = ApplicationTokenHelper_1.ApplicationTokenHelper.generateIdentifier(), server) {
        const obj = tsyringe_1.container.resolve(ServerState_1);
        obj.password = password;
        obj.server = server;
        return obj;
    }
    getToken(name) {
        return this.tokens.find(f => f.name == name);
    }
    async addOrUpdateToken(token) {
        if (this.isEmptyToken(token))
            return token;
        if (util_1.isUndefined(token))
            return token;
        const findTokenIndex = this.findTokenIndexByName(token);
        if (findTokenIndex > -1) {
            this.tokens[findTokenIndex] = token;
        }
        else {
            this.tokens.push(token);
        }
        if (util_1.isUndefined(this.applicationClients))
            return token;
        const index = this.applicationClients.clients.findIndex(f => f.name === token.name);
        if (index > -1) {
            this.applicationClients.clients[index].lastAccess = new Date().getTime();
        }
        await this.writeAll();
        return !token.clone ? undefined : token.clone();
    }
    isValidServerPassword(password) {
        return !!(password && this.password && this.password === password);
    }
    isValidClientPassword(name, password) {
        return !!(password && this.password && this.password === password);
    }
    async validateToken(token) {
        const isValidatedToken = !!this.isValidToken(token);
        return new ServerTokenValidateResult_1.ServerTokenValidateResult(isValidatedToken ? await this.updateSoonToExpireToken(token) : token, isValidatedToken);
    }
    removeExpiredTokens() {
        const countPriorToFilter = this.tokens.length;
        this.tokens = this.filterOutExpiredTokens();
        return countPriorToFilter !== this.tokens.length;
    }
    async loadTokens() {
        return await this.serializeTokensService.dataExists()
            ? await this.readTokens()
            : await this.writeTokens();
    }
    async writeTokens() {
        return (await this.serializeTokensService.serialize(this.tokens)).success;
    }
    async readTokens() {
        const dataResult = await this.serializeTokensService.deserialize();
        if (dataResult.success && dataResult.result) {
            this.tokens = dataResult.result;
            return dataResult.success;
        }
        return false;
    }
    async loadClients() {
        if (util_1.isUndefined(this.applicationClients))
            return;
        return await this.applicationClients.serializeService.dataExists()
            ? await this.readClients()
            : await this.writeClients();
    }
    async writeClients() {
        if (util_1.isUndefined(this.applicationClients))
            return;
        return (await this.applicationClients.serializeService.serialize(this.applicationClients.clients)).success;
    }
    async readClients() {
        if (util_1.isUndefined(this.applicationClients))
            return;
        const dataResult = await this.applicationClients.serializeService.deserialize();
        if (dataResult.success && dataResult.result) {
            this.applicationClients.clients = dataResult.result;
            return dataResult.success;
        }
        return false;
    }
    async resetTokens() {
        this.tokens = [];
        await this.writeTokens();
    }
    async resetClients() {
        if (util_1.isUndefined(this.applicationClients))
            return;
        this.applicationClients.clients = [];
        await this.writeClients();
    }
    async resetAll() {
        await this.resetClients();
        await this.resetTokens();
    }
    async loadAll() {
        return !!(await this.loadClients() && await this.loadTokens());
    }
    async writeAll() {
        return !!(await this.writeClients() && await this.writeTokens());
    }
};
ServerState = ServerState_1 = __decorate([
    tsyringe_1.autoInjectable(),
    __param(0, tsyringe_1.inject('ISerializerService<ApplicationToken[]>')),
    __metadata("design:paramtypes", [Object])
], ServerState);
exports.ServerState = ServerState;
