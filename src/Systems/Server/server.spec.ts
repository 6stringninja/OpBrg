import { Server } from './server';

 

describe('server ', function () {
    it('should load accountItems', function () {
        const test = new Server();
        
        expect(test.config).toBeTruthy();
    });
});