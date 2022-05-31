import { DomainException } from './DomainException';

export function DomainExceptionMixin(msg: string): typeof DomainException {
  return class extends DomainException {
    public constructor() {
      super(msg);
    }
  };
}
