export interface IStartKataRequest {
  userId: string;
  excludeCompletedKatas: boolean;
  previousKataId?: string;
}
