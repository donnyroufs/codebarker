import { ExcludeMethods, IEntity, PartialBy } from '@codebarker/shared';
import { AnalysisStatus } from './AnalysisStatus';

import { AnalysisValidator } from './AnalysisValidator';
import { CannotVoteOnAnalysisException } from './CannotVoteOnAnalysisException';
import { Content } from './Content';
import { HasAlreadyVotedException } from './HasAlreadyVotedException';
import { Smell } from './Smell';
import { Vote } from './Vote';

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
  public readonly status: AnalysisStatus = AnalysisStatus.Pending;
  public readonly votes: Vote[] = [];

  private constructor({
    status = AnalysisStatus.Pending,
    ...props
  }: AnalysisProps) {
    this.id = props.id;
    this.smell = props.smell;
    this.reason = props.reason;
    this.userId = props.userId;
    this.repositoryName = props.repositoryName;
    this.author = props.author;
    this.fileDir = props.fileDir;
    this.content = props.content;
    this.sha = props.sha;
    this.status = status;
    this.votes = props.votes ?? this.votes;
  }

  public addVote(vote: Vote): void {
    if (!this.isPending()) {
      throw new CannotVoteOnAnalysisException();
    }

    if (this.hasAlreadyVoted()) {
      throw new HasAlreadyVotedException();
    }

    this.votes.push(vote);
  }

  private hasAlreadyVoted(): boolean {
    return this.votes.some((vote) => vote.userId === this.userId);
  }

  private isPending(): boolean {
    return this.status === AnalysisStatus.Pending;
  }

  public static make(props: AnalysisProps): Analysis {
    return new AnalysisValidator(props)
      .validateOrThrow()
      .andThen(() => new Analysis(props));
  }
}

export type AnalysisProps = PartialBy<
  ExcludeMethods<Analysis>,
  'status' | 'votes'
>;
