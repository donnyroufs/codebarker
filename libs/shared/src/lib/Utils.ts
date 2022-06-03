import { NullOr } from './types';

export function isNull<T>(value: NullOr<T>): value is null {
  return value === null;
}

export function cast<T>(target: any): T {
  return target as T;
}
