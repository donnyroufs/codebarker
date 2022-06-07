import { DomainException } from '@codebarker/shared';

export class NoAvailableAnalysisForUserException extends DomainException {
  public constructor() {
    super('You have already voted on all available analyses');
  }
}
