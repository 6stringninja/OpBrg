import { ApplicationClient } from '../Application/ApplicationClient';
import { singleton } from 'tsyringe';
import fs from 'fs';
import { ApplicationToken } from '../Application/ApplicationToken';

export class SerializerResult<T> {
    success = false;
    result?: T | undefined;
}
export interface ISerializerService<T> {
    serialize(itemToSerialize: T): SerializerResult<string>;
    deserialize(): SerializerResult<T>;
}


export abstract class SerializerJsonFileService<T> implements ISerializerService<T> {

    constructor(public filename = '') {}

    serialize(itemToSerialize:T): SerializerResult<string> {

        const result = new SerializerResult<string>();
        result.result = JSON.stringify(itemToSerialize);
       try {
        fs.writeFileSync(this.filePath(), result.result, 'utf8');
        result.success = true;
       } catch (error) {
           console.log(error);
           result.success = false;
       }

        return result;

    }
    filePath = () =>`${__dirname}\\${this.filename}`;
    deserialize(): SerializerResult<T> {


        const result = new SerializerResult<T>();
     
        try {
            result.result = JSON.parse(fs.readFileSync(this.filePath(), 'utf8')) as T;
            result.success = true;
        } catch (error) {
            result.success = false;
        }
        return result;
    }
}
@singleton()
export class ApplicationClientsSerializerJsonFileService extends SerializerJsonFileService<ApplicationClient[]> {
    constructor() { super('applicationClients.json');}
}

@singleton()
export class ApplicationTokensSerializerJsonFileService extends SerializerJsonFileService<ApplicationToken[]> {
    constructor() { super('applicationTokens.json'); }
}