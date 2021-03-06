"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express = require("express");
const ServerConfig_json_1 = __importDefault(require("../Config/ServerConfig.json"));
const tsyringe_1 = require("tsyringe");
const ServerDi_1 = require("./ServerDi");
const ServerState_1 = require("./ServerState");
const index_1 = require("./Messages/index");
const ClientLogger_1 = require("./Logger/ClientLogger");
class Server {
    constructor(config = ServerConfig_json_1.default) {
        this.config = config;
        this.app = express();
        this.serverMessages = [];
        this.serverRoutePrefix = 'api';
        this.getApiUrl = (name) => `/${this.serverRoutePrefix}/${name}`;
        new ServerDi_1.ServerDi().load(tsyringe_1.container);
        this.serverState = ServerState_1.ServerState.create(config.serverPassword, this);
        this.clientLogger = new ClientLogger_1.ClientLogger(this);
        if (!this.serverState.loadAll())
            throw new Error('failed to load json files');
    }
    async initMessages() {
        this.serverMessages = index_1.Messages(this.serverState);
        this.serverMessages.forEach(m => {
            this.app.post(this.getApiUrl(m.name), (req, res) => m.processExpress(req, res));
        });
    }
    async start() {
        this.app.use(express.json());
        const myLogger = (req, res, next) => {
            next();
        };
        this.app.use(myLogger);
        await this.initMessages();
        this.listener = this.app.listen(this.config.port, () => {
            console.log(`OpBorg listening on port http://localhost:${this.config.port}/ !`);
        });
    }
    async stop() {
        if (this.listener) {
            this.listener.close();
        }
    }
}
exports.Server = Server;
