import {
  AnalysisReportDto,
  GetMyAnalysisReportsResponse,
  IFetchMyAnalysisReports,
  IGetMyAnalysisReportsRequest,
} from '@codebarker/application';
import { AnalysisStatus, AnalysisType, Smell } from '@codebarker/domain';
import { injectable } from 'inversify';

import { PrismaService } from '../PrismaService';

@injectable()
export class FetchMyAnalysisReportsPrismaFetcherImpl
  implements IFetchMyAnalysisReports
{
  private readonly _prismaService: PrismaService;

  public constructor(prisma: PrismaService) {
    this._prismaService = prisma;
  }

  public async fetch({
    userId,
    amount,
    offset,
  }: IGetMyAnalysisReportsRequest): Promise<GetMyAnalysisReportsResponse> {
    const count = await this._prismaService.analysis.count({
      where: {
        userId: userId.value,
      },
    });

    const result = await this._prismaService.analysis.findMany({
      where: {
        userId: userId.value,
      },
      skip: offset * amount,
      take: amount,
      select: {
        id: true,
        smell: true,
        votes: {
          select: {
            type: true,
          },
        },
        status: true,
        content: {
          select: {
            programmingLanguage: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return GetMyAnalysisReportsResponse.from({
      count,
      hasMore: this.hasMore(result.length, amount, offset, count),
      reports: result.map((x) => {
        const totalVotes = x.votes.length;
        const agreed = x.votes.filter(
          (vote) => vote.type === AnalysisType.Agree
        ).length;
        const disagreed = totalVotes - agreed;

        return AnalysisReportDto.make({
          id: x.id,
          agreed,
          disagreed,
          language: x.content.programmingLanguage.name,
          percentage:
            totalVotes === 0 ? 0 : Math.floor((agreed / totalVotes) * 100),
          smell: Smell[x.smell]!,
          status: this.statusToText(x.status),
        });
      }),
    });
  }

  private statusToText(status: AnalysisStatus): string {
    return {
      0: 'pending',
      1: 'declined',
      2: 'approved',
    }[status];
  }
  private hasMore(
    fetchedCount: number,
    amountToFetch: number,
    offset: number,
    totalCount: number
  ): boolean {
    if (fetchedCount < amountToFetch) return false;
    if (this.getTotalFetched(offset, amountToFetch) >= totalCount) return false;

    return true;
  }

  private getTotalFetched(offset: number, amountToFetch: number): number {
    return (offset + 1) * amountToFetch;
  }
}
