"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerializeService_1 = require("../Services/SerializeService");
class ServerDi {
    constructor() {
    }
    run(container) {
        container.registerSingleton('ISerializerService<ApplicationClient[]>', SerializeService_1.ApplicationClientsSerializerJsonFileService);
        container.registerSingleton('ISerializerService<ApplicationToken[]>', SerializeService_1.ApplicationTokensSerializerJsonFileService);
    }
}
exports.ServerDi = ServerDi;
