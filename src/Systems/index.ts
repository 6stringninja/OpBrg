import { Server } from './Server/Server';
import { Client } from './Client/Client';


const cl = new Client();
//console.log(cl.config);

const server = new Server();
//console.log(server.config);
 server.start();