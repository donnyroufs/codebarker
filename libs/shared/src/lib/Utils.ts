import { NullOr } from './types';

export function isNull<T>(value: NullOr<T>): value is null {
  return value === null;
}
