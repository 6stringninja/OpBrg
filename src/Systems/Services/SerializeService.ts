import { ApplicationClient } from '../Application/ApplicationClient';
import { singleton } from 'tsyringe';
import fs from 'fs';
import { ApplicationToken } from '../Application/ApplicationToken';
import { ClientStateData } from '../Client/ClientStateData';
import { RSA_NO_PADDING } from 'constants';

export class SerializerResult<T> {
    success = false;
    result?: T | undefined;
}
export interface ISerializerService<T> {
    serialize(itemToSerialize: T): SerializerResult<string>;
    deserialize(): SerializerResult<T>;
    dataExists(): boolean;
}


export abstract class SerializerJsonFileService<T> implements ISerializerService<T> {


    constructor(public filename = '') {}

    serialize(itemToSerialize: T): SerializerResult<string> {

        const result = new SerializerResult<string>();
        result.result = JSON.stringify(itemToSerialize);

       try {
        fs.writeFileSync(this.filePath(), result.result, 'utf8');
        result.success = true;
       } catch (error) {

           result.success = false;
       }

        return result;

    }
    filePath = () => {
    let dirname  = __dirname;
        const dirs = dirname.split('\\');
        if (dirs.length > 1) {
            dirs[dirs.length - 1] = 'Data';
            dirname = dirs.join('\\');
            if (!fs.existsSync(dirname)) fs.mkdirSync(dirname);
        }

        return `${dirname}\\${this.filename}`;
    }
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
    dataExists(): boolean {
      return   fs.existsSync(this.filePath());
    }
}
@singleton()
export class ApplicationClientsSerializerJsonFileService extends SerializerJsonFileService<ApplicationClient[]> {
    constructor() { super('applicationClients.json'); }
}

@singleton()
export class ApplicationTokensSerializerJsonFileService extends SerializerJsonFileService<ApplicationToken[]> {
    constructor() { super('applicationTokens.json'); }
}

@singleton()
export class ClientStateDataSerializerJsonFileService extends SerializerJsonFileService<ClientStateData> {
    constructor() { super('clientStateData.json'); }
}