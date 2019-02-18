import { ApplicationToken } from '../Application/ApplicationToken';

export class ServerTokenValidateResult {
  constructor(public token: ApplicationToken | undefined, public success = false) { }
}
