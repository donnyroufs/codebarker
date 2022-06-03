import { Smell } from '@codebarker/domain';

import { ContentDto } from '../../dtos';

export interface ISubmitAnalysisRequest {
  smell: Smell;
  reason: string;
  userId: string;
  repositoryName: string;
  author: string;
  fileDir: string;
  content: ContentDto;
}
