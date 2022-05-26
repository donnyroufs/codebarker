import { ValidationException, Validator } from '../../src';

class Person {
  public id!: string;
  public age!: number;
}

class PersonValidator extends Validator<Person> {
  protected defineRules(): void {
    this.ruleFor('id', Validator.is.string);
  }
}

describe('Validator', () => {
  test('does not return validation errors when valid', () => {
    const person = new Person();
    person.id = 'id';
    person.age = 12;

    const validator = new PersonValidator(person);
    const result = validator.validate();

    expect(result.ok).toBe(true);
  });

  test('does return validation errors when invalid', () => {
    const person = new Person();
    person.id = 20 as any;
    person.age = 12;
    const validator = new PersonValidator(person);

    const result = validator.validate();

    expect(result.err).toBe(true);
  });

  test('throws a validation exception', () => {
    const person = new Person();
    person.id = 20 as any;
    person.age = 12;
    const validator = new PersonValidator(person);

    const act = (): void => validator.validateOrThrow().unwrap();

    expect(act).toThrowError(ValidationException);
  });

  describe('predicates', () => {
    test.todo('returns validation error when invalid date');
    test.todo('returns no validation error when valid date');
    test.todo('returns validation error when invalid number');
    test.todo('returns no validation error when valid number');
    test.todo('returns validation error when invalid string');
    test.todo('returns no validation error when valid string');
    test.todo('returns validation error when invalid boolean');
    test.todo('returns no validation error when valid boolean');
  });
});
