import { ApplicationToken } from '../Application/ApplicationToken';
import { ApplicationClient } from '../Application/ApplicationClient';
import { ApplicationTokenHelper } from '../Application/ApplicationTokenHelper';

export class ClientStateData {
  constructor(
    public token:
      | ApplicationToken
      | undefined = ApplicationTokenHelper.createToken(''),
    public client: ApplicationClient | undefined = new ApplicationClient('', '')
  ) {}
}
