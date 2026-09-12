import OpenAI from 'openai';

export const createOpenAI = (apiKey: string) => {
  return new OpenAI({ apiKey });
};
