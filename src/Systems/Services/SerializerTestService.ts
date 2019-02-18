import { ApplicationClient } from '../Application/ApplicationClient';
import { singleton } from 'tsyringe';
import { ISerializerService, SerializerResult } from './SerializeService';
import { ApplicationToken } from '../Application/ApplicationToken';
@singleton()
export class ApplicationClientSerializerTestService
  implements ISerializerService<ApplicationClient[]> {
  fakeitems: ApplicationClient[] | undefined;
  serialize(itemToSerialize: ApplicationClient[]): SerializerResult<string> {
    this.fakeitems = itemToSerialize;
    const result = new SerializerResult<string>();
    result.result = JSON.stringify(itemToSerialize);
    result.success = true;
    return result;
  }
  deserialize(): SerializerResult<ApplicationClient[]> {
    if (!this.fakeitems) this.fakeitems = [];
    const result = new SerializerResult<ApplicationClient[]>();
    result.result = this.fakeitems;
    result.success = true;
    return result;
  }
}
@singleton()
export class ApplicationTokensSerializerTestService
    implements ISerializerService<ApplicationToken[]> {
    fakeitems: ApplicationToken[] | undefined;
    serialize(itemToSerialize: ApplicationToken[]): SerializerResult<string> {
        this.fakeitems = itemToSerialize;
        const result = new SerializerResult<string>();
        result.result = JSON.stringify(itemToSerialize);
        result.success = true;
        return result;
    }
    deserialize(): SerializerResult<ApplicationToken[]> {
        if (!this.fakeitems) this.fakeitems = [];
        const result = new SerializerResult<ApplicationToken[]>();
        result.result = this.fakeitems;
        result.success = true;
        return result;
    }
}