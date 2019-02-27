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
var ClientState_1;
"use strict";
const tsyringe_1 = require("tsyringe");
const SerializeService_1 = require("../Services/SerializeService");
const ClientStateData_1 = require("./ClientStateData");
tsyringe_1.container.register('ISerializerService<ClientStateData>', {
    useClass: SerializeService_1.ClientStateDataSerializerJsonFileService
});
let ClientState = ClientState_1 = class ClientState {
    constructor(serializeClientStateDataService) {
        this.serializeClientStateDataService = serializeClientStateDataService;
        this.serializeClientStateDataService.deserialize().then((result) => {
            if (result.success && result.result) {
                this.stateData = result.result;
            }
        });
    }
    static async create(stateData = undefined) {
        const obj = tsyringe_1.container.resolve(ClientState_1);
        if (stateData) {
            obj.stateData = stateData;
            await obj.writeStateData();
        }
        else {
            await obj.loadStateData();
        }
        return obj;
    }
    async writeStateData() {
        if (this.stateData)
            return (await this.serializeClientStateDataService.serialize(this.stateData)).success;
        return false;
    }
    async readStateData() {
        const dataResult = await this.serializeClientStateDataService.deserialize();
        if (dataResult.success && dataResult.result) {
            this.stateData = dataResult.result;
            return dataResult.success;
        }
        return false;
    }
    async loadStateData() {
        return await this.serializeClientStateDataService.dataExists()
            ? await this.readStateData()
            : await this.writeStateData();
    }
    async resetStateData() {
        this.stateData = new ClientStateData_1.ClientStateData();
        await this.writeStateData();
    }
};
ClientState = ClientState_1 = __decorate([
    tsyringe_1.autoInjectable(),
    __param(0, tsyringe_1.inject('ISerializerService<ClientStateData>')),
    __metadata("design:paramtypes", [Object])
], ClientState);
exports.ClientState = ClientState;
