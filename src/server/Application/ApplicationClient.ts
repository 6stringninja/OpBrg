import { ApplicationTokenHelper } from './ApplicationTokenHelper';
export class ApplicationClient {
  constructor(
    public name = '',
    public password = ApplicationTokenHelper.generateIdentifier()
  ) {}
}
