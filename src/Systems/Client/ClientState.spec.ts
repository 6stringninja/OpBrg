import { container } from 'tsyringe';
import { ClientStateDataSerializerJsonFileService } from '../Services/SerializeService';
import {ClientState} from './ClientState'
import { ClientStateData } from './ClientStateData';
import { ApplicationToken } from '../Application/ApplicationToken';
import { ApplicationClient } from '../Application/ApplicationClient';
describe('Client State', function () {
    container.register('ISerializerService<ClientStateData>', {
        useClass: ClientStateDataSerializerJsonFileService
    });
    let clientState: ClientState = undefined;
    beforeEach(function () {
          clientState = ClientState.create();
        
    });
    it('should be defined', function () {
       
        expect(clientState).toBeDefined();
    });
    it('should assign state data to be defined', function () {
        clientState = ClientState.create();

        expect( clientState.stateData).toBeDefined();
    });
    it('should assign state data when passed in', function () {
        clientState = ClientState.create(
            new ClientStateData(ApplicationToken.create('test','1'),
            new ApplicationClient('test','test')
            ));
        expect(clientState.stateData.token.name === 'test'
         && clientState.stateData.client.name === 'test').toBeTruthy();
    });
    it('should assign state data should reset', function () {
        clientState = ClientState.create(
            new ClientStateData(ApplicationToken.create('test', '1'),
                new ApplicationClient('test', 'test')
            ));
        expect(clientState.stateData.token.name === 'test'
            && clientState.stateData.client.name === 'test').toBeTruthy();
        clientState.resetStateData();
        console.log(clientState.stateData);
        expect(clientState.stateData.token.name === ''
            && clientState.stateData.client.name === '').toBeTruthy();
    });
})