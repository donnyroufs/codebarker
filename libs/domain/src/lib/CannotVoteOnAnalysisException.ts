import { DomainException } from '@codebarker/shared';

export class CannotVoteOnAnalysisException extends DomainException {
  public constructor() {
    super(`You cannot vote on analysis because it is not in Pending.`);
  }
}
