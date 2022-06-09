import { IGetMyAnalysisReportsRequest } from '../../src';

export class GetMyAnalysisReportsRequestFactory {
  public static make(
    props?: Partial<IGetMyAnalysisReportsRequest>
  ): IGetMyAnalysisReportsRequest {
    return {
      offset: 0,
      userId: 'userId',
      ...props,
    };
  }

  public static makeBadInput(): IGetMyAnalysisReportsRequest[] {
    return [
      {
        userId: 1 as any,
        offset: 0,
      },
      {
        userId: 'userId',
        offset: 'cursor' as any,
      },
    ];
  }
}
