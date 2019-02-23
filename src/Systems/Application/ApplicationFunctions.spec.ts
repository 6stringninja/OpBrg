import { getTimestamp } from './ApplicationFunctions';
describe('application functions', () => {
  it('should return timestamp', () =>
    expect(getTimestamp()).toBeGreaterThan(0));
});
