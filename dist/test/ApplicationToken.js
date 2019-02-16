"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApplicationToken {
    constructor(name = '', id = undefined, issued = 0) {
        this.name = name;
        this.id = id;
        this.issued = issued;
    }
}
exports.ApplicationToken = ApplicationToken;
