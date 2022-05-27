import { ValidationException } from '../exceptions/ValidationException';
import { ExcludeMethods, NullOr } from '../types';
import { isNull } from '../Utils';
import { Rule } from './Rule';
import { ValidationResult } from './ValidationResult';

export abstract class Validator<T> {
  private readonly _target: T;
  private readonly _rules: Rule[] = [];

  public constructor(target: T) {
    this._target = target;
    this.defineRules();
  }

  protected abstract defineRules(): void;

  protected ruleFor<Prop extends keyof ExcludeMethods<T>>(
    prop: Prop,
    predicate: (value: T[Prop]) => boolean,
    message?: string
  ): void {
    this._rules.push({
      predicate,
      prop,
      message,
    });
  }

  public validate(): NullOr<ValidationResult[]> {
    const result = this.makeResult();

    if (result.length === 0) {
      return null;
    }

    return result;
  }

  public validateOrThrow(): this {
    const result = this.validate();

    if (!isNull(result)) {
      throw ValidationException.fromValidationResults(result);
    }

    return this;
  }

  public andThen<T>(cb: () => T): T {
    return cb();
  }

  private makeResult(): ValidationResult[] {
    return this._rules
      .map((rule) => {
        const value = this._target[rule.prop as keyof T];
        const isValid = rule.predicate(value);

        if (isValid) return null;

        return new ValidationResult(rule.prop, rule.message);
      })
      .filter((val) => val !== null) as ValidationResult[];
  }

  public static is = new (class {
    public number(value: any): value is number {
      return typeof value === 'number';
    }

    public date(value: any): value is Date {
      return value instanceof Date;
    }

    public string(value: any): value is string {
      return typeof value === 'string';
    }

    public boolean(value: any): value is boolean {
      return typeof value === 'boolean';
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    public instance<T extends Function>(value: any, type: T): value is T {
      return value instanceof type;
    }

    public enum<T>(value: any, enumType: T): value is T {
      return Object.values(enumType).includes(value);
    }
  })();
}
