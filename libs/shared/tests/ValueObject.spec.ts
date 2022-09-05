import { ValueObject } from '../src/lib/ValueObject';

const enum Scale {
  Celsius = 1,
  Fahrenheit,
  Kelvin,
}

type Props = {
  value: number;
  scale: Scale;
};

class Temperature extends ValueObject<Props> {
  public static make(props: Props): Temperature {
    return new Temperature(props);
  }
}


describe('value object', () => {
  test('they are the same', () => {
    const temp = Temperature.make({
      scale: Scale.Celsius,
      value: 10,
    });
    const tempTwo = Temperature.make({
      scale: Scale.Celsius,
      value: 10,
    });

    expect(temp.equals(tempTwo)).toBe(true);
  });

  test('they are not the same', () => {
    const temp = Temperature.make({
      scale: Scale.Celsius,
      value: 12,
    });
    const tempTwo = Temperature.make({
      scale: Scale.Celsius,
      value: 10,
    });

    expect(temp.equals(tempTwo)).toBe(false);
  });
});
