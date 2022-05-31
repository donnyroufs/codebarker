export class ValidationResult {
  public readonly prop: string;
  public readonly message?: string;

  public constructor(prop: string, message?: string) {
    this.prop = prop;
    this.message = message;
  }
}
