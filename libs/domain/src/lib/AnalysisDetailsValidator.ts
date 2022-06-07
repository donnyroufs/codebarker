import { Validator } from '@codebarker/shared';

import { AnalysisDetailsProps } from './AnalysisDetails';
import { AnalysisStatus } from './AnalysisStatus';
import { Content } from './Content';
import { ProgrammingLanguage } from './ProgrammingLanguage';
import { Smell } from './Smell';
import { User } from './User';

export class AnalysisDetailsValidator extends Validator<AnalysisDetailsProps> {
  protected defineRules(): void {
    this.ruleFor('analysisId', Validator.is.string);
    this.ruleFor('agreedVotesCount', Validator.is.number);
    this.ruleFor('content', (val) => Validator.is.instance(val, Content));
    this.ruleFor('disagreedVotesAcount', Validator.is.number);
    this.ruleFor('programmingLanguage', (val) =>
      Validator.is.instance(val, ProgrammingLanguage)
    );
    this.ruleFor('reason', Validator.is.string);
    this.ruleFor('reportedBy', (val) => Validator.is.instance(val, User));
    this.ruleFor('smell', (val) => Validator.is.enum(val, Smell));
    this.ruleFor('status', (val) => Validator.is.enum(val, AnalysisStatus));
  }
}
