"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express = require("express");
const ServerConfig_json_1 = __importDefault(require("./ServerConfig.json"));
const tsyringe_1 = require("tsyringe");
const ServerDi_1 = require("./ServerDi");
const ServerState_1 = require("./ServerState");
const CreateClientMessage_1 = require("./Messages/CreateClientMessage");
const ApplicationClientCreateResult_1 = require("../Application/ApplicationClientCreateResult");
const index_1 = require("./Messages/index");
class Server {
    constructor(config = ServerConfig_json_1.default) {
        this.config = config;
        this.app = express();
        this.serverMessages = [];
        this.serverRoutePrefix = 'api';
        new ServerDi_1.ServerDi().load(tsyringe_1.container);
        this.serverState = ServerState_1.ServerState.create(config.serverPassword);
        if (!this.serverState.loadAll())
            throw new Error('failed to load json files');
    }
    initMessages() {
        this.serverMessages = index_1.Messages(this.serverState);
        this.serverMessages.forEach(m => {
            this.app.post(`${this.serverRoutePrefix}/${m.name}`, m.express);
        });
    }
    start() {
        this.app.use(express.json());
        this.initMessages();
        this.app.post('/api/createnew', (req, res) => {
            const param = req.body;
            const retrn = new CreateClientMessage_1.CreateClientMessageResult();
            if (!!param && this.serverState) {
                const result = this.serverState.applicationClients.createClient(param.name, param.serverpassword, param.clientpassword);
                retrn.success = result === ApplicationClientCreateResult_1.ApplicationClientCreateResult.Success;
                retrn.error = retrn.success ? undefined : result.toString();
            }
            res.send(retrn);
        });
        this.app.listen(this.config.port, () => {
            console.log(`Example app listening on port http://localhost:${this.config.port}/ !`);
        });
    }
}
exports.Server = Server;
