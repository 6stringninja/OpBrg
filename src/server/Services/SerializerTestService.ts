import { ApplicationClient } from '../Application/ApplicationClient';
import { singleton } from 'tsyringe';
import { ISerializerService, SerializerResult } from './SerializeService';
@singleton()
export class SerializerTestService implements ISerializerService<ApplicationClient[]> {
    fakeitems: ApplicationClient[] | undefined;
    serialize(itemToSerialize: ApplicationClient[]): SerializerResult<string> {
        this.fakeitems = itemToSerialize;
        const result = new SerializerResult<string>();
        result.result = JSON.stringify(itemToSerialize);
        result.success = true;
        return result;
    }
    deserialize(): SerializerResult<ApplicationClient[]> {
        if (!this.fakeitems)
            this.fakeitems = [];
        const result = new SerializerResult<ApplicationClient[]>();
        result.result = this.fakeitems;
        result.success = true;
        return result;
    }
}
