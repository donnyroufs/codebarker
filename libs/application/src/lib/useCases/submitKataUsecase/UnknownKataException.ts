import { DomainException } from '@codebarker/shared';

export class UnknownKataException extends DomainException {
  public constructor(id: string) {
    super(`The kata you tried to access with id '${id}' is unknown`);
  }
}
