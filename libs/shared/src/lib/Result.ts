import { DomainException } from './exceptions/DomainException';
import { NullOr } from './types';

/**
 * Use the result pattern to determine the outcome of an operation
 * @param success If the operation was a success or not
 * @param error The error if it was a failure
 * @param value If the operation was a success, it has a value
 */
export class Result<T> {
  public success: boolean;
  public error: DomainException;
  private readonly value!: T;

  private constructor(
    success: boolean,
    error: NullOr<DomainException>,
    value: T
  ) {
    // the result camt be successful and have an error
    if (success && error)
      throw new Error(
        'A result cannot be successful and have an error message'
      );
    // the result cant be a failure without an error
    if (!success && !error)
      throw new Error('A result cannot be a failure without an error message');

    this.success = success;
    this.error = error!;
    if (success) this.value = value;
  }

  /**
   * @returns The value of the result if the result was successful.
   * Otherwise it throws an error because you should be checking if it was a success.
   */
  public toValue(): T {
    if (!this.success)
      throw new Error(
        'You need to check that the result is not a failure first\n' +
          this.error.message
      );

    return this.value;
  }

  /**
   * The operation was successful
   * @param value The value that the operation returned
   * @returns Result
   */
  public static ok<V>(value: V): Result<V> {
    return new Result<V>(true, null, value);
  }

  /**
   * @returns A string error if the operation failed, or a
   * JSON string of the value if successful
   */
  public toString(): string {
    if (!this.success) return this.error.toString();
    return JSON.stringify(this.value);
  }

  /**
   * The operation failed
   * @param error The error associated with the result. Can be a string
   * @returns Result
   */
  public static fail(error: DomainException): Result<any> {
    return new Result(false, error, null);
  }

  /**
   * Check to see if any reuslts have errors
   * @param results The results to check
   * @returns Result
   */
  public static combine(...results: Result<any>[]): Result<Result<any>[]> {
    const noErrors = results.every((res) => res.success);
    if (noErrors) return Result.ok(results);
    // finds the first result with an error
    return results.find((res) => res.error)!;
  }

  /**
   * Determine a result based on a callback
   * @param cb The callback function. Must return a boolean
   * @param message The error message
   * @returns Result
   */
  public static determine(cb: () => boolean, message: string): Result<any> {
    const result = cb();
    if (typeof result !== 'boolean')
      throw new Error('"Determine" callback must return a boolean type');

    return result ? Result.ok(true) : Result.fail(new DomainException(message));
  }

  /**
   * Asynchronously try to run callback
   * @param cb The callback to run
   * @returns Result
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public static async tryAsync<T>(cb: Function): Promise<Result<T>> {
    try {
      const res = await cb();
      return Result.ok(res);
    } catch (e: any) {
      return Result.fail(e ?? new Error('tryAsync failed'));
    }
  }

  /**
   * Synchronously try to run a callback
   * @param cb
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public static try<T>(cb: Function): Result<T> {
    try {
      const res = cb();
      return Result.ok(res);
    } catch (e: any) {
      return Result.fail(e);
    }
  }
}
