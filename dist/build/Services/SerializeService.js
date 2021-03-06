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
        this.filePath = () => {
            let dirname = __dirname;
            const dirs = dirname.split('\\');
            if (dirs.length > 1) {
                dirs[dirs.length - 1] = 'Data';
                dirname = dirs.join('\\');
                if (!fs_1.default.existsSync(dirname))
                    fs_1.default.mkdirSync(dirname);
            }
            return `${dirname}\\${this.filename}`;
        };
    }
    async serialize(itemToSerialize) {
        const result = new SerializerResult();
        result.result = JSON.stringify(itemToSerialize);
        try {
            await this.write(itemToSerialize);
            result.success = true;
        }
        catch (error) {
            result.success = false;
        }
        return result;
    }
    async deserialize() {
        const result = new SerializerResult();
        try {
            result.result = await this.read();
            result.success = true;
        }
        catch (error) {
            result.success = false;
        }
        return result;
    }
    async dataExists() {
        return await this.exists();
    }
    write(text) {
        return new Promise((resolve, reject) => {
            fs_1.default.writeFile(this.filePath(), JSON.stringify(text), err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    read() {
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(this.filePath(), 'utf8', (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(JSON.parse(data));
            });
        });
    }
    exists() {
        return new Promise((resolve, reject) => {
            fs_1.default.exists(this.filePath(), (data) => {
                resolve(data);
            });
        });
    }
}
exports.SerializerJsonFileService = SerializerJsonFileService;
let ApplicationClientsSerializerJsonFileService = class ApplicationClientsSerializerJsonFileService extends SerializerJsonFileService {
    constructor() {
        super('applicationClients.json');
    }
};
ApplicationClientsSerializerJsonFileService = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], ApplicationClientsSerializerJsonFileService);
exports.ApplicationClientsSerializerJsonFileService = ApplicationClientsSerializerJsonFileService;
let ApplicationTokensSerializerJsonFileService = class ApplicationTokensSerializerJsonFileService extends SerializerJsonFileService {
    constructor() {
        super('applicationTokens.json');
    }
};
ApplicationTokensSerializerJsonFileService = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], ApplicationTokensSerializerJsonFileService);
exports.ApplicationTokensSerializerJsonFileService = ApplicationTokensSerializerJsonFileService;
let ClientStateDataSerializerJsonFileService = class ClientStateDataSerializerJsonFileService extends SerializerJsonFileService {
    constructor() {
        super('clientStateData.json');
    }
};
ClientStateDataSerializerJsonFileService = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], ClientStateDataSerializerJsonFileService);
exports.ClientStateDataSerializerJsonFileService = ClientStateDataSerializerJsonFileService;
