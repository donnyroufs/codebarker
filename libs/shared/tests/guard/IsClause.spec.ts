import { InvalidArgumentException } from '../../src/lib/exceptions';
import { IsClause } from '../../src/lib/guard';

describe('is clause', () => {
  let sut!: IsClause;

  beforeAll(() => {
    sut = new IsClause();
  });

  describe('email', () => {
    test.each([['john@gmail.com', 'foe@yahoo.com', 'jim@azerty.be']])(
      'does not throw when valid',
      (email) => {
        const result = sut.email('email', email);

        expect(result).toBe(email);
      }
    );

    test.each([['jim', 'foe.com', '  ']])(
      'throws an ArgumentException when invalid',
      (email) => {
        const result = (): string => sut.email('email', email);

        expect(result).toThrowError(InvalidArgumentException);
      }
    );
  });

  describe('boolean', () => {
    test.each([
      [false, false],
      [true, true],
    ])('does not throw when valid', (bool, expected) => {
      const result = sut.boolean('bool', bool);

      expect(result).toBe(expected);
    });

    test.each([[1], [0], [null], [undefined], ['']])(
      'throws an ArgumentException when invalid',
      (invalidValue: any) => {
        const result = (): boolean => sut.boolean('bool', invalidValue);

        expect(result).toThrowError(InvalidArgumentException);
      }
    );
  });

  describe('enum', () => {
    enum Color {
      Green,
      Red,
    }

    enum StringColor {
      Green = 'green',
      Red = 'red',
    }

    test.each([
      [Color, 0],
      [StringColor, 'green'],
    ])('does not throw when valid', (enumerable, value) => {
      const result = sut.enum('color', value, enumerable);

      expect(result).toBe(value);
    });

    test.each([
      [Color, 4],
      [StringColor, 'purple'],
    ])('throws an ArgumentException when invalid', (enumerable, value) => {
      const result = (): any => sut.enum('color', value, enumerable);

      expect(result).toThrowError(InvalidArgumentException);
    });
  });

  describe('number', () => {
    test.each([[1], [0], [-2]])('does not throw when valid', (value) => {
      const result = sut.number('value', value);

      expect(result).toBe(value);
    });

    test.each([false, '', {}])(
      'throws an ArgumentException when invalid',
      (value: any) => {
        const result = (): number => sut.number('value', value);

        expect(result).toThrowError(InvalidArgumentException);
      }
    );
  });
});
