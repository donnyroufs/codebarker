export type NullOr<T> = T | null;
export type AsyncNullOr<T> = Promise<NullOr<T>>;

export type ExcludeMethods<TClass> = Pick<
  TClass,
  {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [K in keyof TClass]: TClass[K] extends Function ? never : K;
  }[keyof TClass]
>;
