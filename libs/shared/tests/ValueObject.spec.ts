import { ValueObject } from '../src/lib/ValueObject';

class Color extends ValueObject {
  public value = 'green';
  public hex = '#999999';

  public constructor(hex?: string) {
    super();
    this.hex = hex ?? this.hex;
  }
}

class ColorV2 extends ValueObject {
  public value = 'green';
  public hex = '#999999';

  public getValue(): string {
    return this.value;
  }
}

describe('value object', () => {
  test('returns true when equal in value', () => {
    const a = new Color();
    const b = new Color();

    expect(a.equals(b)).toBe(true);
  });

  test('returns false when not equal in value', () => {
    const a = new Color('#aaaaaaa');
    const b = new Color();

    expect(a.equals(b)).toBe(false);
  });

  test('it ignores methods', () => {
    const a = new Color();
    const b = new ColorV2();

    expect(a.equals(b)).toBe(true);
  });
});
