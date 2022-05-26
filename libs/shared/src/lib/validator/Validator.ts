import { Err, Ok, Result } from 'ts-results';

import { ValidationException } from '../exceptions/ValidationException';
import { ExcludeMethods } from '../types';
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

  public validate(): Result<void, ValidationResult[]> {
    const result = this.makeResult();

    if (result.length > 0) {
      return Err(result);
    }

    return Ok(void 0);
  }

  /**
   * @note
   * If the result returns an Err this method will handle it for you by
   * throwing a validation exception.
   */
  public validateOrThrow(): Result<void, never> {
    const result = this.validate();

    if (result.err) {
      throw ValidationException.fromValidationResults(result.val);
    }

    return Ok(void 0);
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
  })();
}
