import { Server } from './server';

 

describe('server ', function () {
    it('should load accountItems', function () {
        const test = new Server();
        const loaded = test.load();
        expect(loaded).toBeTruthy();
    });
});