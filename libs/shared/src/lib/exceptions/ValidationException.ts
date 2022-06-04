import { ValidationResult } from '../validator';
import { DomainException } from './DomainException';

// TODO: Fix details type and mapping
export class ValidationException extends DomainException {
  public details: any[];

  public constructor(msg: string, details: any[] = []) {
    super(msg);

    this.details = details;
  }

  public static fromValidationResults(results: ValidationResult[]): any {
    console.log(results);
    // TODO: Improve error message, details are missing
    return new ValidationException('Invalid data received', results);
  }
}
