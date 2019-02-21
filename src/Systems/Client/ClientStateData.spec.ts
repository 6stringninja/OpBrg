import { container } from 'tsyringe';
import { ClientStateDataSerializerJsonFileService } from '../Services/SerializeService';
import { ClientStateData } from './ClientStateData';

describe('Client State', function() {
  container.register('ISerializerService<ClientStateData>', {
    useClass: ClientStateDataSerializerJsonFileService
  });
  let clientStateData: ClientStateData = undefined;
  beforeEach(function() {
    clientStateData = new ClientStateData();
  });
  it('should be defined', function() {
    expect(clientStateData).toBeDefined();
  });
  it('should be defined token & application client', function() {
    expect(clientStateData.client).toBeDefined();
    expect(clientStateData.token).toBeDefined();
  });
});
