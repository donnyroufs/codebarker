import { DomainException } from '@codebarker/shared';

export class OwnersCannotVoteOnTheirOwnAnalysisException extends DomainException {
  public constructor() {
    super('An owner cannot vote on his own analysis');
  }
}
