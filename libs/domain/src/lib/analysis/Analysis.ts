import { BaseEntity } from '@codebarker/shared';

import { AnalysisStatus } from './AnalysisStatus';
import { AnalysisType } from './AnalysisType';
import { AnalysisValidator } from './AnalysisValidator';
import { CannotVoteOnAnalysisException } from './CannotVoteOnAnalysisException';
import { Content } from '../Content';
import { HasAlreadyVotedException } from './HasAlreadyVotedException';
import { OwnersCannotVoteOnTheirOwnAnalysisException } from './OwnersCannotVoteOnTheirOwnAnalysisException';
import { Smell } from '../Smell';
import { Vote } from '../vote/Vote';

export type AnalysisProps = {
  readonly id: string;
  readonly smell: Smell;
  readonly reason: string;
  readonly userId: string;
  readonly repositoryName: string;
  readonly author: string;
  readonly fileDir: string;
  readonly sha?: string;
  readonly content: Content;
  readonly status?: AnalysisStatus;
  readonly votes?: Vote[];
};

export class Analysis extends BaseEntity<AnalysisProps> {
  public static MINIMUM_REQUIRED_VOTES = 10;
  public static MINIMUM_PERCENTAGE = 70;

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

  public constructor(props: AnalysisProps) {
    super(props);

    this.id = props.id;
    this.smell = props.smell;
    this.reason = props.reason;
    this.userId = props.userId;
    this.repositoryName = props.repositoryName;
    this.author = props.author;
    this.fileDir = props.fileDir;
    this.content = props.content;
    this.sha = props.sha;
    this.status = props.status ?? this.status;
    this.votes = props.votes ?? this.votes;
  }

  public addVote(vote: Vote): void {
    if (this.isOwner(vote.userId)) {
      throw new OwnersCannotVoteOnTheirOwnAnalysisException();
    }

    if (!this.isPending()) {
      throw new CannotVoteOnAnalysisException();
    }

    if (this.hasAlreadyVoted(vote.userId)) {
      throw new HasAlreadyVotedException();
    }

    this.votes.push(vote);

    this.setStatusWhenApplicable();
  }

  private isOwner(userId: string): boolean {
    return this.userId === userId;
  }

  // TODO: Refactor, using policies and events
  private setStatusWhenApplicable(): void {
    const totalVotes = this.votes.length;

    if (totalVotes < Analysis.MINIMUM_REQUIRED_VOTES) {
      return;
    }

    const agreedVotesCount = this.votes.filter(
      (vote) => vote.type === AnalysisType.Agree
    ).length;

    const percentage = Math.floor((agreedVotesCount / totalVotes) * 100);

    if (percentage < Analysis.MINIMUM_PERCENTAGE) {
      this.$set('status', AnalysisStatus.Declined);
    }

    this.$set('status', AnalysisStatus.Accepted);
  }

  private hasAlreadyVoted(userId: string): boolean {
    return this.votes.some((vote) => vote.userId === userId);
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
