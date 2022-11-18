import { IEntity } from '@codebarker/shared';

import { AnalysisStatus } from './AnalysisStatus';
import { AnalysisType } from './AnalysisType';
import { CannotVoteOnAnalysisException } from './CannotVoteOnAnalysisException';
import { Content } from '../Content';
import { HasAlreadyVotedException } from './HasAlreadyVotedException';
import { OwnersCannotVoteOnTheirOwnAnalysisException } from './OwnersCannotVoteOnTheirOwnAnalysisException';
import { Smell } from '../Smell';
import { Vote } from '../vote/Vote';
import { UserId } from '../user';
import {
  AnalysisAuthor,
  AnalysisFileDir,
  AnalysisId,
  AnalysisReason,
  AnalysisRepositoryName,
  AnalysisSha,
} from './valueObjects';

export type AnalysisProps = {
  id: AnalysisId;
  smell: Smell;
  reason: AnalysisReason;
  userId: UserId;
  repositoryName: AnalysisRepositoryName;
  author: AnalysisAuthor;
  fileDir: AnalysisFileDir;
  sha?: AnalysisSha;
  content: Content;
  status?: AnalysisStatus;
  votes: Vote[];
};

export class Analysis implements IEntity {
  public static MINIMUM_REQUIRED_VOTES = 10;
  public static MINIMUM_PERCENTAGE = 70;

  private readonly _props: AnalysisProps;

  public get id(): AnalysisId {
    return this._props.id;
  }

  public get smell(): Smell {
    return this._props.smell;
  }

  public get reason(): AnalysisReason {
    return this._props.reason;
  }

  public get userId(): UserId {
    return this._props.userId;
  }

  public get repositoryName(): AnalysisRepositoryName {
    return this._props.repositoryName;
  }

  public get author(): AnalysisAuthor {
    return this._props.author;
  }

  public get fileDir(): AnalysisFileDir {
    return this._props.fileDir;
  }

  public get content(): Content {
    return this._props.content;
  }

  public get sha(): AnalysisSha | undefined {
    return this._props.sha;
  }

  public get status(): AnalysisStatus {
    return this._props.status ?? AnalysisStatus.Pending;
  }

  public get votes(): Vote[] {
    return this._props.votes ?? [];
  }

  protected constructor(props: AnalysisProps) {
    this._props = {
      ...props,
      votes: props.votes ?? [],
      status: props.status ?? AnalysisStatus.Pending,
    };
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

    this._props.votes.push(vote);

    this.setStatusWhenApplicable();
  }

  private isOwner(userId: UserId): boolean {
    return this._props.userId.equals(userId);
  }

  // TODO: Refactor, using policies and events
  private setStatusWhenApplicable(): void {
    const totalVotes = this._props.votes.length;

    if (totalVotes < Analysis.MINIMUM_REQUIRED_VOTES) {
      return;
    }

    const agreedVotesCount = this._props.votes.filter(
      (vote) => vote.type === AnalysisType.Agree
    ).length;

    const percentage = Math.floor((agreedVotesCount / totalVotes) * 100);

    if (percentage < Analysis.MINIMUM_PERCENTAGE) {
      this._props.status = AnalysisStatus.Declined;
    }

    this._props.status = AnalysisStatus.Accepted;
  }

  private hasAlreadyVoted(userId: UserId): boolean {
    return this._props.votes.some((vote) => vote.userId.equals(userId));
  }

  private isPending(): boolean {
    return this._props.status === AnalysisStatus.Pending;
  }

  public static make(props: AnalysisProps): Analysis {
    return new Analysis(props);
  }
}
