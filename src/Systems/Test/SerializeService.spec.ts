import { SerializerJsonFileService } from '../Services/SerializeService';
import { ApplicationTokenHelper } from '../Application/ApplicationTokenHelper';
export class TestData {
  something = 'something';
}
export class TestDataSerializerJsonFileService extends SerializerJsonFileService<
  TestData
> {
  constructor() {
    super('testData.json');
  }
}

describe('Serialize Service ', function() {
  const test = new TestDataSerializerJsonFileService();
  const rnd = ApplicationTokenHelper.generateIdentifier().toString();
  const testData = new TestData();
  testData.something = rnd;
  console.log('hi');
  it('should load config', async function(done) {
    await test.write(  testData );
    const rslt = await test.read( );
    const exists = await test.exists( );
    console.log(rslt);
   done();
    expect(rslt.something).toBe(testData.something);
    expect(exists).toBe(true);
  });
});
