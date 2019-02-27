import { container, autoInjectable, inject } from 'tsyringe';
import {
  ClientStateDataSerializerJsonFileService,
  ISerializerService
} from '../Services/SerializeService';

import { ClientStateData } from './ClientStateData';

container.register('ISerializerService<ClientStateData>', {
  useClass: ClientStateDataSerializerJsonFileService
});

@autoInjectable()
export class ClientState {
  stateData: ClientStateData | undefined;

  constructor(
    @inject('ISerializerService<ClientStateData>')
    public serializeClientStateDataService: ISerializerService<ClientStateData>
  ) {
      this.serializeClientStateDataService.deserialize().then((result)=>{
      if (result.success && result.result) {
        this.stateData = result.result;
      }

    });
  
  }
  static async create(stateData: ClientStateData | undefined = undefined) {
    const obj = container.resolve(ClientState);
    if (stateData) {
      obj.stateData = stateData;
    await obj.writeStateData();
    } else {
     await obj.loadStateData();
    }

    return obj;
  }
  async writeStateData() {
    if (this.stateData)
      return (await this.serializeClientStateDataService.serialize(this.stateData)
        ).success;
    return false;
  }
  async readStateData() {
    const dataResult = await this.serializeClientStateDataService.deserialize();

    if (dataResult.success && dataResult.result) {
      this.stateData = dataResult.result;
      return dataResult.success;
    }
    return false;
  }
  async loadStateData() {
    return await this.serializeClientStateDataService.dataExists()
      ? await this.readStateData()
      : await this.writeStateData();
  }
  async resetStateData() {
    this.stateData = new ClientStateData();
    await this.writeStateData();
  }
}
