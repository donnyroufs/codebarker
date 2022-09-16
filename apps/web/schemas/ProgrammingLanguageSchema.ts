import z from 'zod';

export const programmingLanguageSchema = z.object({
  name: z.string(),
  extension: z.string(),
});
