"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationToken_1 = require("./ApplicationToken");
class ApplicationTokenHelper {
    constructor(name = '', id = undefined, issued = 0) {
        this.name = name;
        this.id = id;
        this.issued = issued;
    }
    static isAboutToExpire(token) {
        return (token &&
            token.issued &&
            token.issued -
                ApplicationTokenHelper.getMilliSecondsTimeFromHours(ApplicationTokenHelper.renewWindow) <
                new Date().getTime());
    }
    static getMilliSecondsTimeFromHours(hours = 0) {
        return hours * 3600000;
    }
    static setTokenIssuedAndId(token) {
        token.id = ApplicationTokenHelper.generateIdentifier();
        token.issued = this.generateIssuedTime();
        return token;
    }
    static createToken(name) {
        return this.isObject(name)
            ? this.setTokenIssuedAndId(this.copyToken(name))
            : ApplicationToken_1.ApplicationToken.create(name, ApplicationTokenHelper.generateIdentifier(), this.generateIssuedTime());
    }
    static copyToken(t) {
        return t ? Object.assign({}, t) : undefined;
    }
}
ApplicationTokenHelper.expireHours = 12;
ApplicationTokenHelper.renewWindow = 1;
ApplicationTokenHelper.renewAuto = true;
ApplicationTokenHelper.generateIssuedTime = (d = new Date()) => d.getTime() +
    ApplicationTokenHelper.getMilliSecondsTimeFromHours(ApplicationTokenHelper.expireHours);
ApplicationTokenHelper.generate9CharRandomString = () => Math.random()
    .toString(36)
    .substr(2, 9);
ApplicationTokenHelper.generateIdentifier = (sizeX2 = 3) => {
    let id = '';
    for (let index = 0; index < sizeX2; index++) {
        id += ApplicationTokenHelper.generate9CharRandomString();
    }
    return id;
};
ApplicationTokenHelper.isObject = (what) => typeof what === 'object';
exports.ApplicationTokenHelper = ApplicationTokenHelper;
