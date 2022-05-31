export type Rule = {
  prop: any;
  predicate: (prop: any) => boolean;
  message?: string;
};
