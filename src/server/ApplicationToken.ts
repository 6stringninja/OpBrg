import 'reflect-metadata';

import { container, singleton, autoInjectable, inject } from 'tsyringe';
import { ApplicationTokenHelper } from './ApplicationTokenHelper';

export interface IUidGenerator {
  generateId(): string;
}
@singleton()
class UidGenerator implements IUidGenerator {
  private id = 0;
  generateId(): string {
    return 'Test' + this.id++;
  }
}
container.registerSingleton('IUidGenerator', UidGenerator);

@autoInjectable()
export class ApplicationToken {
  name = '';
  id: string;
  issued = 0;
  constructor(@inject("IUidGenerator") private uidGenerator?: IUidGenerator) {}
  clone = () => ApplicationTokenHelper.copyToken(this);
  test= () => this.uidGenerator.generateId();
  static create(name = '', id = undefined, issued = 0) {
    const token = container.resolve(ApplicationToken);
    console.log(token);
    token.name = name;
    token.id = id;
    token.issued = issued;
   // console.log(token.test());
    return token;
  }
}
