import { ExcludeMethods, IEntity } from '@codebarker/shared';

import { AnalysisValidator } from './AnalysisValidator';
import { Content } from './Content';
import { Smell } from './Smell';

export class Analysis implements IEntity {
  public readonly id: string;
  public readonly smell: Smell;
  public readonly reason: string;
  public readonly userId: string;

  public readonly repositoryName: string;
  public readonly author: string;
  public readonly fileDir: string;
  public readonly sha?: string;

  public readonly content: Content;

  private constructor(props: AnalysisProps) {
    this.id = props.id;
    this.smell = props.smell;
    this.reason = props.reason;
    this.userId = props.userId;
    this.repositoryName = props.repositoryName;
    this.author = props.author;
    this.fileDir = props.fileDir;
    this.content = props.content;
    this.sha = props.sha;
  }

  public static make(props: AnalysisProps): Analysis {
    return new AnalysisValidator(props)
      .validateOrThrow()
      .andThen(() => new Analysis(props));
  }
}

export type AnalysisProps = ExcludeMethods<Analysis>;
