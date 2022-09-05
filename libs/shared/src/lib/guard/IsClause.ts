import { InvalidArgumentException } from '../exceptions';
import { GuardProps } from './GuardProps';
import { IClause } from './IClause';

export class IsClause implements IClause {
  public email<TProps extends GuardProps>(
    prop: keyof TProps,
    value: string
  ): string {
    if (!value.includes('@')) {
      throw new InvalidArgumentException(
        prop,
        'does not seem to be a valid email'
      );
    }

    return value;
  }

  public boolean<TProps extends GuardProps>(
    prop: keyof TProps,
    value: boolean
  ): boolean {
    if (typeof value !== 'boolean') {
      throw new InvalidArgumentException(prop, "has to be of type 'Boolean'");
    }

    return value;
  }

  public number<TProps extends GuardProps>(
    prop: keyof TProps,
    value: number
  ): number {
    if (typeof value !== 'number') {
      throw new InvalidArgumentException(prop, "has to be of type 'Number'");
    }

    return value;
  }

  public string<TProps extends GuardProps>(
    prop: keyof TProps,
    value: string
  ): string {
    if (typeof value !== 'string') {
      throw new InvalidArgumentException(prop, "has to be of type 'String'");
    }

    return value;
  }

  public enum<TProps extends GuardProps, TEnum>(
    prop: keyof TProps,
    value: TEnum,
    ref: any
  ): TEnum {
    const referenceValues = Object.values(ref);

    if (!referenceValues.includes(value)) {
      throw new InvalidArgumentException(prop, "has to be of type 'Enum'");
    }

    return value;
  }
}
