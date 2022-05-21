import { DomainException } from '@codebarker/shared';

export class NoAvailableKatasException extends DomainException {
  public constructor() {
    super('There are no available katas at this moment');
  }
}
