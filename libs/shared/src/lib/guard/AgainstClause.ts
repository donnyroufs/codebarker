import { InvalidArgumentException } from '../exceptions';
import { GuardProps } from './GuardProps';
import { IClause } from './IClause';

export class AgainstClause implements IClause {
  public nullOrWhiteSpace<TProps extends GuardProps>(
    prop: keyof TProps,
    value: string
  ): string {
    if (value == null) {
      throw new InvalidArgumentException<TProps>(
        prop,
        'cannot be null or undefined'
      );
    }

    if (typeof value !== 'string') {
      throw new InvalidArgumentException<TProps>(
        prop,
        `cannot be of type '${typeof value}'`
      );
    }

    if (value.trim().length === 0) {
      throw new InvalidArgumentException<TProps>(prop, 'cannot be of length 0');
    }

    return value;
  }
}
