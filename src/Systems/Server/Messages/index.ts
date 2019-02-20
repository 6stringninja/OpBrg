import { ServerState } from '../ServerState';
import { IMessageWrapper } from './Base/MessageWrapperBase';
import { CreateClientMessageWrapper } from './CreateClientMessage';
import { GetTokenMessageWrapper } from './GetTokenMessage';
import { IamAliveMessageWrapper } from './IamAlliveMessage';
import { TestClientMessageWrapper } from './TestClientMessage';

export function Messages(serverState: ServerState | undefined): IMessageWrapper[] {
    return !!serverState ? [
        new CreateClientMessageWrapper(serverState),
        new GetTokenMessageWrapper(serverState),
        new IamAliveMessageWrapper(serverState),
        new TestClientMessageWrapper(serverState),
    ]: [];
}