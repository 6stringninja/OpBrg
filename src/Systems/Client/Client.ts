import ClientConfig from './ClientConfig.json';
import { IClientConfig } from './ClientConfig';
export class Client {
    constructor(public config: IClientConfig = ClientConfig as IClientConfig) {}
}