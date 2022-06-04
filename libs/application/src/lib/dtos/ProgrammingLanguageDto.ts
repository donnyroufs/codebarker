import { ProgrammingLanguage } from '@codebarker/domain';
import { ExcludeMethods } from '@codebarker/shared';

export class ProgrammingLanguageDto {
  public readonly name: string;
  public readonly extension: string;

  private constructor(props: ProgrammingLanguageProps) {
    this.name = props.name;
    this.extension = props.extension;
  }

  public static make(props: ProgrammingLanguageProps): ProgrammingLanguageDto {
    return new ProgrammingLanguageDto(props);
  }

  public static toDomain(dto: ProgrammingLanguageDto): ProgrammingLanguage {
    return ProgrammingLanguage.make({
      extension: dto.extension,
      name: dto.name,
    });
  }
}

export type ProgrammingLanguageProps = ExcludeMethods<ProgrammingLanguageDto>;
