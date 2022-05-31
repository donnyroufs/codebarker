import { Smell } from '@codebarker/domain';

export interface ISubmitKataRequest {
  kataId: string;
  userId: string;
  smell: Smell;
}
