
export interface IFetcher<TInput, TOutput> {
  fetch(input: TInput): Promise<TOutput>;
}