"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerializeService_1 = require("../Services/SerializeService");
class ClientDi {
    constructor() { }
    load(container) {
        container.registerSingleton('ISerializerService<ApplicationToken>', SerializeService_1.ApplicationTokensSerializerJsonFileService);
    }
}
exports.ClientDi = ClientDi;
