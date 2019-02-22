import { Client } from '../Client';
import { ClientRequestBase } from './Base/ClientRequestBase';
import { IamAliveMessageInput, IamAliveMessageResult } from '../../Server/Messages/IamAlliveMessage';
export class IamAliveRequest extends ClientRequestBase<IamAliveMessageInput, IamAliveMessageResult> {
    constructor(client: Client) {
        super(new IamAliveMessageInput(), new IamAliveMessageResult(), client);
    }
}
