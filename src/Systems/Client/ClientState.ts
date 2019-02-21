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
    const result = this.serializeClientStateDataService.deserialize();
    if (result.success && result.result) {
      this.stateData = result.result;
    }
  }
  static create(stateData: ClientStateData | undefined = undefined) {
    const obj = container.resolve(ClientState);
    if (stateData) {
      obj.stateData = stateData;
      obj.writeStateData();
    } else {
      obj.loadStateData();
    }

    return obj;
  }
  writeStateData() {
    if (this.stateData)
      return this.serializeClientStateDataService.serialize(this.stateData)
        .success;
    return false;
  }
  readStateData() {
    const dataResult = this.serializeClientStateDataService.deserialize();

    if (dataResult.success && dataResult.result) {
      this.stateData = dataResult.result;
      return dataResult.success;
    }
    return false;
  }
  loadStateData() {
    return this.serializeClientStateDataService.dataExists()
      ? this.readStateData()
      : this.writeStateData();
  }
  resetStateData() {
    this.stateData = new ClientStateData();
    this.writeStateData();
  }
}
