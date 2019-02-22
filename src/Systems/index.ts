import { Server } from './Server/Server';
import { Client } from './Client/Client';
import { MessageTypesArray } from './Server/Messages/Base/MessageTypes';


const cl = new Client();
const server = new Server();

 server.start();