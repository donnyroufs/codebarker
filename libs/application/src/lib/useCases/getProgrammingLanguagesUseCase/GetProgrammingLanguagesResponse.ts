import { ProgrammingLanguage } from '@codebarker/domain';

import { ProgrammingLanguageDto } from '../../dtos';

export class GetProgrammingLanguagesResponse {
  public readonly programmingLanguages: ProgrammingLanguageDto[];

  private constructor(programmingLanguages: ProgrammingLanguageDto[]) {
    this.programmingLanguages = programmingLanguages;
  }

  public static from(
    programmingLanguages: ProgrammingLanguage[]
  ): GetProgrammingLanguagesResponse {
    return new GetProgrammingLanguagesResponse(
      programmingLanguages.map((p) => ({
        extension: p.extension,
        name: p.name,
      }))
    );
  }
}
