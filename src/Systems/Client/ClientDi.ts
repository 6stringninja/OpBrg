import { DependencyContainer } from 'tsyringe';
import { UidGeneratorService } from '../Services/UidGeneratorService';
import { ApplicationClientSerializerTestService } from '../Services/SerializerTestService';
import {
  ApplicationTokensSerializerJsonFileService,
  ApplicationClientsSerializerJsonFileService
} from '../Services/SerializeService';

export class ClientDi {
  constructor() {}
  load(container: DependencyContainer): void {
    container.registerSingleton(
      'ISerializerService<ApplicationToken>',
      ApplicationTokensSerializerJsonFileService
    );
  }
}
