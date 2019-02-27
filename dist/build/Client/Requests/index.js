"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageWrapperBase_1 = require("../../Server/Messages/Base/MessageWrapperBase");
const TestClientRequest_1 = require("../Requests/TestClientRequest");
const CreateClientRequest_1 = require("./CreateClientRequest");
const GetTokenRequest_1 = require("./GetTokenRequest");
const IamAliveRequest_1 = require("./IamAliveRequest");
class Requests {
    constructor(client) {
        this.client = client;
        this.getStateData = () => {
            if (this.client.clientState && this.client.clientState.stateData) {
                return this.client.clientState.stateData;
            }
            return undefined;
        };
        this.getState = () => {
            if (this.client.clientState && this.client.clientState.stateData) {
                return this.client.clientState;
            }
            return undefined;
        };
    }
    async Test(input) {
        return await this.post(new TestClientRequest_1.TestClientRequest(this.client), input);
    }
    async CreateClient(input) {
        return await this.post(new CreateClientRequest_1.CreateClientRequest(this.client), input);
    }
    async GetToken(input) {
        return await this.post(new GetTokenRequest_1.GetTokenRequest(this.client), input);
    }
    async IamAlive(input) {
        return await this.post(new IamAliveRequest_1.IamAliveRequest(this.client), input);
    }
    async post(message, input) {
        try {
            if (!input.token &&
                this.client.clientState &&
                this.client.clientState.stateData)
                input.token = this.client.clientState.stateData.token;
            message.messageInput = input;
            const result = await message.post();
            message.messageResult = Object.assign(message.messageResult, result);
            this.client.updatetoken(message);
            return result;
        }
        catch (error) {
            return new MessageWrapperBase_1.ErrorMessageResult(error);
        }
    }
}
exports.Requests = Requests;
