import clientConfig from './ClientConfig.json';
import { IClientConfig } from './ClientConfig';
describe('client config', function () {
    it('should load config', function () {
        expect((clientConfig as IClientConfig).clientPassword).toBeTruthy();
        expect(true).toBe(true);
    });
});