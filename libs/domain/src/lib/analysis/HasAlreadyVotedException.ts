import { DomainException } from '@codebarker/shared';

export class HasAlreadyVotedException extends DomainException {
  public constructor() {
    super('You have already voted on this Analysis');
  }
}
