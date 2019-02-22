import { Client } from '../Client';
import { ClientRequestBase } from './Base/ClientRequestBase';
import { CreateClientMessageInput, CreateClientMessageResult } from '../../Server/Messages/CreateClientMessage';
export class CreateClientRequest extends ClientRequestBase<CreateClientMessageInput, CreateClientMessageResult> {
    constructor(client: Client) {
        super(new CreateClientMessageInput(), new CreateClientMessageResult(), client);
    }
}
