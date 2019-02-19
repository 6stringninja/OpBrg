import { ApplicationTokenHelper } from './ApplicationTokenHelper';
export class ApplicationClient {
  lastAccess = new Date().getTime();
  constructor(
    public name = '',
    public password = ApplicationTokenHelper.generateIdentifier()
  ) {}
}
