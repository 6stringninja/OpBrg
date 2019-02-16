"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ApplicationToken_1;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const ApplicationTokenHelper_1 = require("./ApplicationTokenHelper");
let UidGenerator = class UidGenerator {
    constructor() {
        this.id = 0;
    }
    generateId() {
        return 'Test' + this.id++;
    }
};
UidGenerator = __decorate([
    tsyringe_1.singleton()
], UidGenerator);
tsyringe_1.container.registerSingleton('IUidGenerator', UidGenerator);
let ApplicationToken = ApplicationToken_1 = class ApplicationToken {
    constructor(uidGenerator) {
        this.uidGenerator = uidGenerator;
        this.name = '';
        this.issued = 0;
        this.clone = () => ApplicationTokenHelper_1.ApplicationTokenHelper.copyToken(this);
        this.test = () => this.uidGenerator.generateId();
    }
    static create(name = '', id = undefined, issued = 0) {
        const token = tsyringe_1.container.resolve(ApplicationToken_1);
        console.log(token);
        token.name = name;
        token.id = id;
        token.issued = issued;
        // console.log(token.test());
        return token;
    }
};
ApplicationToken = ApplicationToken_1 = __decorate([
    tsyringe_1.autoInjectable(),
    __param(0, tsyringe_1.inject("IUidGenerator"))
], ApplicationToken);
exports.ApplicationToken = ApplicationToken;
