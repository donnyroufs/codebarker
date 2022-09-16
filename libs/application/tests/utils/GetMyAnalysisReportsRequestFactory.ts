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
}
