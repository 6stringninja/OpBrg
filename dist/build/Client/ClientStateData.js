"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationClient_1 = require("../Application/ApplicationClient");
const ApplicationTokenHelper_1 = require("../Application/ApplicationTokenHelper");
class ClientStateData {
    constructor(token = ApplicationTokenHelper_1.ApplicationTokenHelper.createToken(''), client = new ApplicationClient_1.ApplicationClient('', '')) {
        this.token = token;
        this.client = client;
    }
}
exports.ClientStateData = ClientStateData;
