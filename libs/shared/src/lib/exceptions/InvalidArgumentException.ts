import { DomainException } from './DomainException';

export class InvalidArgumentException<
  TProps extends Record<string, unknown>
> extends DomainException {
  public constructor(arg: keyof TProps, reason: string) {
    super(`the argument '${arg as string}' is invalid because '${reason}'.`);
  }
}
