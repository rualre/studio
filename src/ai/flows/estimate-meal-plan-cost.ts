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
  prompt: `Eres un experto asesor financiero especializado en estimar el costo de los planes de comidas en Colombia.

Recibirás un plan de comidas y una moneda, y estimarás el costo total del plan de comidas en esa moneda basándote en los precios promedio en Colombia.

Plan de Comidas: {{{mealPlan}}}
Moneda: {{{currency}}}

Considera los precios de los ingredientes en Colombia y estima el costo total del plan de comidas.
Devuelve solo el costo estimado como un número. No incluyas el símbolo de la moneda. No incluyas ninguna otra explicación o texto.`,
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
