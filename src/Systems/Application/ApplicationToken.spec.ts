import { ApplicationTokenHelper } from './ApplicationTokenHelper';
import { ApplicationToken } from './ApplicationToken';
describe('Application Token Helper', function() {
  it('static method generateIdentifier generates id 27 chars long', function() {
    const id = ApplicationTokenHelper.generateIdentifier();

    expect(!!id).toBe(true);
    expect(id.length).toBe(27);
  });
  it('static method generateIdentifier generates id 9 chars long', function() {
    const id = ApplicationTokenHelper.generateIdentifier(1);

    expect(!!id).toBe(true);
    expect(id.length).toBe(9);
  });
  it('static method generateIdentifier generates id to be different', function() {
    const id = ApplicationTokenHelper.generateIdentifier();
    const id2 = ApplicationTokenHelper.generateIdentifier();

    expect(!!id).toBe(true);
    expect(!!id2).toBe(true);
    expect(id === id2).toBe(false);
  });
  it('static method generateIdentifier generates token', function() {
    const id = ApplicationTokenHelper.createToken('test');

    expect(id.name).toBe('test');
    expect(id.id.length).toBe(27);
    expect(id.issued).toBeGreaterThan(new Date().getTime());

    const t2 = ApplicationTokenHelper.createToken(id);
    expect(t2.name).toBe('test');
    expect(t2.id.length).toBe(27);
    expect(t2.issued).toBeGreaterThan(new Date().getTime());

    expect(t2.id === id.id).toBe(false);
    expect(t2.issued).toBeGreaterThanOrEqual(id.issued);
  });
  it('static method token is about to expire', function() {
    const id = ApplicationTokenHelper.createToken('test');
    expect(ApplicationTokenHelper.isAboutToExpire(id)).toBe(false);
    id.issued = new Date().getTime() - 1000;
    expect(ApplicationTokenHelper.isAboutToExpire(id)).toBe(true);
  });
  it('generated ids should be created and unique', function() {
    const id = ApplicationTokenHelper.createToken('test');
    const token2 = ApplicationToken.create('test1');
    const nid = token2.generateIdentifier();

    expect(id.id).toBeTruthy();
    expect(token2.id).toBeTruthy();
    expect(token2.id !== id.id).toBeTruthy();
  });
});
