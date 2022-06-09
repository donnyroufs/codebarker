type Predicate = () => boolean;

export class PluralizeUtil {
  public static pluralize(value: string, suffix = 's'): string {
    return value + suffix;
  }

  public static maybePluralize(
    predicate: Predicate,
    value: string,
    suffix = 's'
  ): string {
    if (!predicate()) return value;

    return this.pluralize(value, suffix);
  }
}
