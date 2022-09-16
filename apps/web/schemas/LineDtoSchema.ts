import z from 'zod';

export const lineDtoSchema = z.object({
  lineNumber: z.number(),
  value: z.string(),
  isInfected: z.boolean(),
});
