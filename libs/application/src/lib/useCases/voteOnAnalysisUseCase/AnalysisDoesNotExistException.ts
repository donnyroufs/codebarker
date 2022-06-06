import { DomainException } from '@codebarker/shared';

export class AnalysisDoesNotExistException extends DomainException {
  public constructor(id: string) {
    super(`The analysis with the id: '${id} does not exist'`);
  }
}
