import { Smell } from '@codebarker/domain';

import { ContentDto } from '../../dtos';
import { LineDto } from '../../dtos/LineDto';

export interface ISubmitAnalysisRequest {
  smell: Smell;
  reason: string;
  userId: string;
  repositoryName: string;
  author: string;
  fileDir: string;
  content: ContentDto;
  infectedLines: LineDto[];
}
