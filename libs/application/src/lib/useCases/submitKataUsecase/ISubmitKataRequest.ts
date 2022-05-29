import { Smell } from '@codebarker/domain';

export interface ISubmitKataRequest {
  kataId: string;
  userId: string;
  answerId: string;
  smell: Smell;
}
