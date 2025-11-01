'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating keywords for an article.
 *
 * The flow takes article content as input and returns a list of keywords.
 * It exports:
 *   - `generateArticleKeywords`: The function to trigger the keyword generation flow.
 *   - `GenerateArticleKeywordsInput`: The input type for the generateArticleKeywords function.
 *   - `GenerateArticleKeywordsOutput`: The output type for the generateArticleKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArticleKeywordsInputSchema = z.object({
  articleContent: z.string().describe('The content of the article to generate keywords for.'),
});
export type GenerateArticleKeywordsInput = z.infer<typeof GenerateArticleKeywordsInputSchema>;

const GenerateArticleKeywordsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('A list of keywords for the article.'),
});
export type GenerateArticleKeywordsOutput = z.infer<typeof GenerateArticleKeywordsOutputSchema>;

export async function generateArticleKeywords(input: GenerateArticleKeywordsInput): Promise<GenerateArticleKeywordsOutput> {
  return generateArticleKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArticleKeywordsPrompt',
  input: {schema: GenerateArticleKeywordsInputSchema},
  output: {schema: GenerateArticleKeywordsOutputSchema},
  prompt: `You are an SEO expert. Generate a list of keywords for the following article content. The keywords should be relevant to the content and help readers find the article.

Article Content:
{{{articleContent}}}

Keywords:`,
});

const generateArticleKeywordsFlow = ai.defineFlow(
  {
    name: 'generateArticleKeywordsFlow',
    inputSchema: GenerateArticleKeywordsInputSchema,
    outputSchema: GenerateArticleKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
