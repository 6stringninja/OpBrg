import { ApplicationTokenHelper } from './ApplicationTokenHelper';

export class ApplicationToken {
  constructor(public name = '', public id = undefined, public issued = 0) {}
  clone = () => ApplicationTokenHelper.copyToken(this);
}
