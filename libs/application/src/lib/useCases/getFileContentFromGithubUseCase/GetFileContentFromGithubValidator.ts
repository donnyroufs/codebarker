import { Validator } from '@codebarker/shared';

import { IGetFileContentFromGithubRequest } from './IGetFileContentFromGithubRequest';

export class GetFileContentFromGithubValidator extends Validator<IGetFileContentFromGithubRequest> {
  protected defineRules(): void {
    this.ruleFor(
      'author',
      Validator.is.string,
      'Author must be of type String'
    );
    this.ruleFor(
      'fileDir',
      Validator.is.string,
      'FileDir must be of type String'
    );
    this.ruleFor(
      'repositoryName',
      Validator.is.string,
      'repositoryName must be of type String'
    );
  }
}
