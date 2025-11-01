'use server';

/**
 * @fileOverview Generates a summary of an article.
 *
 * - generateArticleSummary - A function that generates an article summary.
 * - GenerateArticleSummaryInput - The input type for the generateArticleSummary function.
 * - GenerateArticleSummaryOutput - The return type for the generateArticleSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArticleSummaryInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the article to summarize.'),
  topic: z.string().describe('The main topic of the article.'),
});
export type GenerateArticleSummaryInput = z.infer<
  typeof GenerateArticleSummaryInputSchema
>;

const GenerateArticleSummaryOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the article.'),
});
export type GenerateArticleSummaryOutput = z.infer<
  typeof GenerateArticleSummaryOutputSchema
>;

export async function generateArticleSummary(
  input: GenerateArticleSummaryInput
): Promise<GenerateArticleSummaryOutput> {
  return generateArticleSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArticleSummaryPrompt',
  input: {schema: GenerateArticleSummaryInputSchema},
  output: {schema: GenerateArticleSummaryOutputSchema},
  prompt: `You are an expert editor. Generate a concise summary of the following article content, focusing on the main points and key arguments. The article is about "{{{topic}}}".\n\nArticle Content:\n{{{articleContent}}}\n\nSummary:`,
});

const generateArticleSummaryFlow = ai.defineFlow(
  {
    name: 'generateArticleSummaryFlow',
    inputSchema: GenerateArticleSummaryInputSchema,
    outputSchema: GenerateArticleSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
