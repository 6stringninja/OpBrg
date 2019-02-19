"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./Server/Server");
const Client_1 = require("./Client/Client");
const cl = new Client_1.Client();
console.log(cl.config);
const server = new Server_1.Server();
console.log(server.config);
server.start();
