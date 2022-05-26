import { Option, Result } from 'ts-results';

export type NullOr<T> = T | null;
export type AsyncNullOr<T> = Promise<NullOr<T>>;

export type ExcludeMethods<TClass> = Pick<
  TClass,
  {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [K in keyof TClass]: TClass[K] extends Function ? never : K;
  }[keyof TClass]
>;

export type AsyncResult<T, E extends Error = Error> = Promise<Result<T, E>>;
export type AsyncOption<T> = Promise<Option<T>>;

export type Constructor<T> = new (...args: any[]) => T;
