'use server';
/**
 * @fileOverview This file defines the Genkit flow for estimating the cost of a meal plan.
 *
 * - estimateMealPlanCost - Estimates the total cost of a meal plan based on average prices in Colombia.
 * - EstimateMealPlanCostInput - The input type for the estimateMealPlanCost function.
 * - EstimateMealPlanCostOutput - The return type for the estimateMealPlanCost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateMealPlanCostInputSchema = z.object({
  mealPlan: z.string().describe('The meal plan for the week.'),
  currency: z.string().describe('The currency to estimate the cost in, e.g. COP'),
});
export type EstimateMealPlanCostInput = z.infer<typeof EstimateMealPlanCostInputSchema>;

const EstimateMealPlanCostOutputSchema = z.object({
  estimatedCost: z.number().describe('The estimated total cost of the meal plan.'),
});
export type EstimateMealPlanCostOutput = z.infer<typeof EstimateMealPlanCostOutputSchema>;

export async function estimateMealPlanCost(input: EstimateMealPlanCostInput): Promise<EstimateMealPlanCostOutput> {
  return estimateMealPlanCostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateMealPlanCostPrompt',
  input: {schema: EstimateMealPlanCostInputSchema},
  output: {schema: EstimateMealPlanCostOutputSchema},
  prompt: `You are an expert financial advisor specializing in estimating the cost of meal plans in Colombia.

You will receive a meal plan and a currency, and you will estimate the total cost of the meal plan in that currency based on average prices in Colombia.

Meal Plan: {{{mealPlan}}}
Currency: {{{currency}}}

Consider the prices of ingredients in Colombia, and estimate the total cost of the meal plan.
Return only the estimated cost as a number.  Do not include the currency symbol.  Do not include any other explanation or text.`,
});

const estimateMealPlanCostFlow = ai.defineFlow(
  {
    name: 'estimateMealPlanCostFlow',
    inputSchema: EstimateMealPlanCostInputSchema,
    outputSchema: EstimateMealPlanCostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
