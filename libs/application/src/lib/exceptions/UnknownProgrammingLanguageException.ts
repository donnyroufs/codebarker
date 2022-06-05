import { DomainException } from '@codebarker/shared';

export class UnknownProgrammingLanguageException extends DomainException {
  public constructor(extension: string) {
    super(`We do not what language belongs to '${extension}'`);
  }
}
