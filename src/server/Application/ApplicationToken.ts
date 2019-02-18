import 'reflect-metadata';

import { container, autoInjectable, inject } from 'tsyringe';
import { ApplicationTokenHelper } from './ApplicationTokenHelper';
import { UidGeneratorService, IUidGeneratorService } from '../Services/UidGeneratorService';


container.registerSingleton('IUidGeneratorService', UidGeneratorService);

@autoInjectable()
export class ApplicationToken {
  name = '';
  id = '';
  issued = 0;
  constructor(
    @inject('IUidGeneratorService') private UidGeneratorService: IUidGeneratorService
    ) { this.id = UidGeneratorService.generateId(); }

  clone = () => ApplicationTokenHelper.copyToken(this);
  generateIdentifier = () => this.UidGeneratorService.generateId();
  static create(name = '', id = '', issued = 0) {
    const token = container.resolve(ApplicationToken);
   // console.log(token);
    token.name = name;
    token.id = id || token.id;
    token.issued = issued;
    return token;
  }
}
