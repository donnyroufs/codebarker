import { shallowEqual } from 'shallow-equal-object';

export abstract class ValueObject {
  public equals(valueObject: ValueObject): boolean {
    return shallowEqual(Object.values(this), Object.values(valueObject));
  }
}
