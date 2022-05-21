import { DomainException } from './DomainException';

export function DomainExceptionMixin(msg: string) {
  return class extends DomainException {
    public constructor() {
      super(msg);
    }
  };
}
