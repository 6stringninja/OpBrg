"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./Server/Server");
const Client_1 = require("./Client/Client");
const cl = new Client_1.Client();
const server = new Server_1.Server();
server.start();
