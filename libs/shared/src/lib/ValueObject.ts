import { shallowEqual } from 'shallow-equal-object';

// TODO: Check if it works with arrays as values
// TODO: Add toJSON method
export abstract class ValueObject {
  public equals(valueObject: ValueObject): boolean {
    return shallowEqual(Object.values(this), Object.values(valueObject));
  }
}
