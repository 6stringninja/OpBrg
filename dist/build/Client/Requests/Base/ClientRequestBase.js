"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const MessageWrapperBase_1 = require("../../../Server/Messages/Base/MessageWrapperBase");
class ClientRequestBase {
    constructor(messageInput, messageResult, client, authenticated = true) {
        this.messageInput = messageInput;
        this.messageResult = messageResult;
        this.client = client;
        this.authenticated = authenticated;
        this.getUrlPortPart = () => this.client.config.port === 80
            ? ''
            : `:${this.client.config.port.toString()}`;
        this.getApiUrl = (name) => `http://${this.client.config.server}${this.getUrlPortPart()}/api/${name}`;
        if (this.messageInput.typeOf !== messageResult.typeOf)
            throw new Error('ClientRequestBase typeOf does not match');
        this.typeOf = this.messageInput.typeOf;
        this.routeName = this.typeOf.toString();
    }
    get apiUrl() {
        return this.getApiUrl(this.routeName);
    }
    post() {
        const options = {
            url: this.apiUrl,
            method: 'POST',
            json: this.messageInput
        };
        return new Promise((resolve, reject) => {
            let rtrn = this.messageResult;
            try {
                request.post(options, (error, resp, body) => {
                    if (error) {
                        console.error(error);
                        this.messageResult.success = false;
                        this.messageResult.error = error.toString();
                        rtrn = this.messageResult;
                        rtrn = new MessageWrapperBase_1.ErrorMessageResult(error.toString());
                        resolve(rtrn);
                    }
                    else {
                        try {
                            rtrn = body;
                            this.client.updatetoken(this);
                        }
                        catch (error) {
                            rtrn = new MessageWrapperBase_1.ErrorMessageResult(error.toString());
                        }
                        resolve(rtrn);
                    }
                });
            }
            catch (error) {
                rtrn = new MessageWrapperBase_1.ErrorMessageResult(error.toString());
                resolve(rtrn);
            }
        });
    }
}
exports.ClientRequestBase = ClientRequestBase;
