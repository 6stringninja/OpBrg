"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClientConfig_json_1 = __importDefault(require("../Config/ClientConfig.json"));
const ClientState_js_1 = require("./ClientState.js");
class Client {
    constructor(config = ClientConfig_json_1.default) {
        this.config = config;
        this.reset = () => {
            if (this.clientState) {
                this.clientState.readStateData();
            }
            this.init();
        };
        this.init();
    }
    init() {
        this.clientState = ClientState_js_1.ClientState.create();
        this.copyConfigToApplicationClient();
    }
    copyConfigToApplicationClient() {
        if (!this.clientState)
            return;
        if (this.clientState.stateData && this.clientState.stateData.client) {
            this.clientState.stateData.client.name = this.config.name;
            if (!!this.config.clientPassword)
                this.clientState.stateData.client.password = this.config.clientPassword;
            this.clientState.writeStateData();
        }
    }
    updatetoken(result) {
        if (result.authenticated) {
            if (this.clientState && this.clientState.stateData) {
                this.clientState.stateData.token = result.messageResult.token;
                this.clientState.writeStateData();
            }
        }
    }
}
exports.Client = Client;
