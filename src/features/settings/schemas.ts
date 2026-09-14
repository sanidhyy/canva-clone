import { z } from 'zod';

export const apiKeysFormSchema = z.object({
  openaiApiKey: z.string().trim().min(12, { message: 'Invalid OpenAI API key.' }).startsWith('sk-', { message: 'Invalid OpenAI API key.' }),
});

export type ApiKeysFormValues = z.infer<typeof apiKeysFormSchema>;
