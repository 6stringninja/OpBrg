import { ApplicationClient } from '../Application/ApplicationClient';
import { singleton } from 'tsyringe';
import fs from 'fs';

export class SerializerResult<T> {
    success = false;
    result?: T | undefined;
}
export interface ISerializerService<T> {
    serialize(itemToSerialize: T): SerializerResult<string>;
    deserialize(): SerializerResult<T>;
}

@singleton()
export class SerializerJsonFileService implements ISerializerService<ApplicationClient[]> {
    fakeitems: ApplicationClient[] | undefined;
    serialize(itemToSerialize: ApplicationClient[]): SerializerResult<string> {
        this.fakeitems = itemToSerialize;
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
    filePath = () => __dirname + '\clients.json';
    deserialize(): SerializerResult<ApplicationClient[]> {
        if ( !this.fakeitems) this.fakeitems = [];

        const result = new SerializerResult<ApplicationClient[]>();
        result.result =  JSON.parse(fs.readFileSync(this.filePath(), 'utf8'))as ApplicationClient[];
        result.success = true;
        return result;
    }
}