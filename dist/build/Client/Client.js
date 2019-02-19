"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClientConfig_json_1 = __importDefault(require("./ClientConfig.json"));
class Client {
    constructor(config = ClientConfig_json_1.default) {
        this.config = config;
    }
}
exports.Client = Client;
