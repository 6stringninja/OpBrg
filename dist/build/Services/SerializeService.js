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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const fs_1 = __importDefault(require("fs"));
class SerializerResult {
    constructor() {
        this.success = false;
    }
}
exports.SerializerResult = SerializerResult;
class SerializerJsonFileService {
    constructor(filename = '') {
        this.filename = filename;
        this.filePath = () => `${__dirname}\\${this.filename}`;
    }
    serialize(itemToSerialize) {
        const result = new SerializerResult();
        result.result = JSON.stringify(itemToSerialize);
        try {
            fs_1.default.writeFileSync(this.filePath(), result.result, 'utf8');
            result.success = true;
        }
        catch (error) {
            result.success = false;
        }
        return result;
    }
    deserialize() {
        const result = new SerializerResult();
        try {
            result.result = JSON.parse(fs_1.default.readFileSync(this.filePath(), 'utf8'));
            result.success = true;
        }
        catch (error) {
            result.success = false;
        }
        return result;
    }
    dataExists() {
        return fs_1.default.existsSync(this.filePath());
    }
}
exports.SerializerJsonFileService = SerializerJsonFileService;
let ApplicationClientsSerializerJsonFileService = class ApplicationClientsSerializerJsonFileService extends SerializerJsonFileService {
    constructor() { super('applicationClients.json'); }
};
ApplicationClientsSerializerJsonFileService = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], ApplicationClientsSerializerJsonFileService);
exports.ApplicationClientsSerializerJsonFileService = ApplicationClientsSerializerJsonFileService;
let ApplicationTokensSerializerJsonFileService = class ApplicationTokensSerializerJsonFileService extends SerializerJsonFileService {
    constructor() { super('applicationTokens.json'); }
};
ApplicationTokensSerializerJsonFileService = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], ApplicationTokensSerializerJsonFileService);
exports.ApplicationTokensSerializerJsonFileService = ApplicationTokensSerializerJsonFileService;
let ClientStateDataSerializerJsonFileService = class ClientStateDataSerializerJsonFileService extends SerializerJsonFileService {
    constructor() { super('clientStateData.json'); }
};
ClientStateDataSerializerJsonFileService = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], ClientStateDataSerializerJsonFileService);
exports.ClientStateDataSerializerJsonFileService = ClientStateDataSerializerJsonFileService;
