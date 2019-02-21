
import serverConfig from '../Config/ServerConfig.json';
import { IServerConfig } from './ServerConfig';
describe('server config', function () {
    it('should load config', function () {
        expect((serverConfig as IServerConfig).serverPassword).toBeTruthy();
        expect(true).toBe(true);
    });
});