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
const ServerTokens_js_1 = require("./ServerTokens.js");
class Server {
    constructor(config = ServerConfig_json_1.default) {
        this.config = config;
        this.app = express();
        new ServerDi_1.ServerDi().run(tsyringe_1.container);
        this.serverTokens = ServerTokens_js_1.ServerTokens.create(this.config.serverPassword);
    }
    load() {
        return !!(this.serverTokens.loadClients() &&
            this.serverTokens.loadTokens());
    }
    run() {
        this.load();
        this.app.get('/', function (req, res) {
            res.send('Hello World!');
        });
        this.app.listen(this.config.port, () => {
            console.log(`Example app listening on port ${this.config.port}!`);
        });
    }
}
exports.Server = Server;
