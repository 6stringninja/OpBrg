"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationTokenHelper_1 = require("./ApplicationTokenHelper");
class ApplicationClient {
    constructor(name = '', password = ApplicationTokenHelper_1.ApplicationTokenHelper.generateIdentifier()) {
        this.name = name;
        this.password = password;
        this.lastAccess = new Date().getTime();
    }
}
exports.ApplicationClient = ApplicationClient;
