import { singleton } from 'tsyringe';
import { ApplicationTokenHelper } from '../Application/ApplicationTokenHelper';
export interface IUidGeneratorService {
  generateId(): string;
}

@singleton()
export class UidGeneratorService implements IUidGeneratorService {
  private id = 0;
  generateId(): string {
    return ApplicationTokenHelper.generateIdentifier();
  }
}

