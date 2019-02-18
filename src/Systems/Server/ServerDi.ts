import { DependencyContainer } from 'tsyringe';
import { UidGeneratorService } from '../Services/UidGeneratorService';
import { ApplicationClientSerializerTestService, ApplicationTokensSerializerTestService } from '../Services/SerializerTestService';
import { ApplicationTokensSerializerJsonFileService, ApplicationClientsSerializerJsonFileService } from '../Services/SerializeService';

export class ServerDi {

  constructor() {

  }
  load(container: DependencyContainer): void {

    container.registerSingleton(
      'ISerializerService<ApplicationClient[]>',
      ApplicationClientsSerializerJsonFileService
    );
    container.registerSingleton(
      'ISerializerService<ApplicationToken[]>',
      ApplicationTokensSerializerJsonFileService
    );
  }
}