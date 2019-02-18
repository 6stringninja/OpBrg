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
var ApplicationToken_1;
"use strict";
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const ApplicationTokenHelper_1 = require("./ApplicationTokenHelper");
const UidGeneratorService_1 = require("../Services/UidGeneratorService");
tsyringe_1.container.registerSingleton('IUidGeneratorService', UidGeneratorService_1.UidGeneratorService);
let ApplicationToken = ApplicationToken_1 = class ApplicationToken {
    constructor(UidGeneratorService) {
        this.UidGeneratorService = UidGeneratorService;
        this.name = '';
        this.id = '';
        this.issued = 0;
        this.clone = () => ApplicationTokenHelper_1.ApplicationTokenHelper.copyToken(this);
        this.generateIdentifier = () => this.UidGeneratorService.generateId();
        this.id = UidGeneratorService.generateId();
    }
    static create(name = '', id = '', issued = 0) {
        const token = tsyringe_1.container.resolve(ApplicationToken_1);
        token.name = name;
        token.id = id || token.id;
        token.issued = issued;
        return token;
    }
};
ApplicationToken = ApplicationToken_1 = __decorate([
    tsyringe_1.autoInjectable(),
    __param(0, tsyringe_1.inject('IUidGeneratorService')),
    __metadata("design:paramtypes", [Object])
], ApplicationToken);
exports.ApplicationToken = ApplicationToken;
