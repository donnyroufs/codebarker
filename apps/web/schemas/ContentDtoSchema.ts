import z from 'zod';

import { lineDtoSchema } from './LineDtoSchema';
import { programmingLanguageSchema } from './ProgrammingLanguageSchema';

export const contentDtoSchema = z.object({
  lines: z.array(lineDtoSchema),
  programmingLanguage: programmingLanguageSchema,
});
