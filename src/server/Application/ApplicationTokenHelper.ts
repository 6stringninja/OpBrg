import { ApplicationToken } from './ApplicationToken';
import { container } from 'tsyringe';
import { isUndefined } from 'util';
export class ApplicationTokenHelper {
  constructor(public name = '', public id = undefined, public issued = 0) { }

  static expireHours = 12;
  static renewWindow = 1;
  static renewAuto = true;
  private static generateIssuedTime = (d = new Date()) =>
    d.getTime() +
    ApplicationTokenHelper.getMilliSecondsTimeFromHours(
      ApplicationTokenHelper.expireHours
    );

  private static generate9CharRandomString = () =>
    Math.random()
      .toString(36)
      .substr(2, 9);

  static generateIdentifier = (sizeX2 = 3) => {
    let id = '';
    for (let index = 0; index < sizeX2; index++) {
      id += ApplicationTokenHelper.generate9CharRandomString();
    }
    return id;
  };

  static isAboutToExpire(token: ApplicationToken | undefined): boolean {
    return !!(
      token &&
      token.issued &&
      token.issued -
      ApplicationTokenHelper.getMilliSecondsTimeFromHours(
        ApplicationTokenHelper.renewWindow
      ) <
      new Date().getTime()
    );
  }

  static getMilliSecondsTimeFromHours(hours = 0) {
    return hours * 3600000;
  }
  static setTokenIssuedAndId(token: ApplicationToken | undefined): ApplicationToken | undefined {
    if (!isUndefined(token)) {

      token.id = token.generateIdentifier();
      token.issued = this.generateIssuedTime();
    }
    return token;
  }
  private static isObject = (what: any) => typeof what === 'object';

  static createToken(name: string | ApplicationToken): ApplicationToken | undefined {
    return this.isObject(name)
      ? this.setTokenIssuedAndId(this.copyToken(name as ApplicationToken))
      : ApplicationToken.create(
        name as string,
        container.resolve(ApplicationToken).generateIdentifier(),
        this.generateIssuedTime()
      );
  }

  static copyToken(t: ApplicationToken): ApplicationToken | undefined {
    return t ? Object.assign({}, t) : undefined;
  }
}
