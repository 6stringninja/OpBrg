"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const SerializeService_1 = require("./SerializeService");
let ApplicationClientSerializerTestService = class ApplicationClientSerializerTestService {
    dataExists() {
        return true;
    }
    serialize(itemToSerialize) {
        this.fakeitems = itemToSerialize;
        const result = new SerializeService_1.SerializerResult();
        result.result = JSON.stringify(itemToSerialize);
        result.success = true;
        return result;
    }
    deserialize() {
        if (!this.fakeitems)
            this.fakeitems = [];
        const result = new SerializeService_1.SerializerResult();
        result.result = this.fakeitems;
        result.success = true;
        return result;
    }
};
ApplicationClientSerializerTestService = __decorate([
    tsyringe_1.singleton()
], ApplicationClientSerializerTestService);
exports.ApplicationClientSerializerTestService = ApplicationClientSerializerTestService;
let ApplicationTokensSerializerTestService = class ApplicationTokensSerializerTestService {
    dataExists() {
        return true;
    }
    serialize(itemToSerialize) {
        this.fakeitems = itemToSerialize;
        const result = new SerializeService_1.SerializerResult();
        result.result = JSON.stringify(itemToSerialize);
        result.success = true;
        return result;
    }
    deserialize() {
        if (!this.fakeitems)
            this.fakeitems = [];
        const result = new SerializeService_1.SerializerResult();
        result.result = this.fakeitems;
        result.success = true;
        return result;
    }
};
ApplicationTokensSerializerTestService = __decorate([
    tsyringe_1.singleton()
], ApplicationTokensSerializerTestService);
exports.ApplicationTokensSerializerTestService = ApplicationTokensSerializerTestService;
