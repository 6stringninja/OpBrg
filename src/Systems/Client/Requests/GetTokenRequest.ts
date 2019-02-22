import { Client } from '../Client';
import { ClientRequestBase } from './Base/ClientRequestBase';
import { GetTokenMessageInput, GetTokenMessageResult } from '../../Server/Messages/GetTokenMessage';
export class GetTokenRequest extends ClientRequestBase<GetTokenMessageInput, GetTokenMessageResult> {
    constructor(client: Client) {
        super(new GetTokenMessageInput(), new GetTokenMessageResult(), client);
    }
}
