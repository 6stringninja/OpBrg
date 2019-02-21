import { Client } from '../Client';
import { TestClientMessageInput, TestClientMessageResult } from '../../Server/Messages/TestClientMessage';
import { ClientRequestBase } from './Base/ClientRequestBase';
export class TestClientRequest extends ClientRequestBase<TestClientMessageInput, TestClientMessageResult> {
    constructor(client: Client) {
        super(new TestClientMessageInput(), new TestClientMessageResult(), client);
    }
}
