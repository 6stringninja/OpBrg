import { ApplicationClient } from '../Application/ApplicationClient';
import { singleton } from 'tsyringe';
import { ISerializerService, SerializerResult } from './SerializeService';
import { ApplicationToken } from '../Application/ApplicationToken';
@singleton()
export class ApplicationClientSerializerTestService
  implements ISerializerService<ApplicationClient[]> {
  dataExists(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  deserialize(): Promise<SerializerResult<ApplicationClient[]>> {
    throw new Error('Method not implemented.');
  }
  serialize(itemToSerialize: ApplicationClient[]): Promise<SerializerResult<string>> {
   
    throw new Error('Method not implemented.');
    
  }
  write(b: ApplicationClient[]): Promise<{}> {
    throw new Error('Method not implemented.');
  }
  read(): Promise<ApplicationClient[]> {
    throw new Error('Method not implemented.');
  }
  exists(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
 /*
  serialize(itemToSerialize: ApplicationClient[]): SerializerResult<string> {
    this.fakeitems = itemToSerialize;
    const result = new SerializerResult<string>();
    result.result = JSON.stringify(itemToSerialize);
    result.success = true;
    return result;
  }*/
  
 
  fakeitems: ApplicationClient[] | undefined;
}
/*
  deserialize(): SerializerResult<ApplicationClient[]> {
    if (!this.fakeitems) this.fakeitems = [];
    const result = new SerializerResult<ApplicationClient[]>();
    result.result = this.fakeitems;
    result.success = true;
    return result;
  }

@singleton()
export class ApplicationTokensSerializerTestService
  implements ISerializerService<ApplicationToken[]> {
  dataExists(): boolean {
    return true;
  }
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
*/