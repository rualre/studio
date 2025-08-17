'use server';
/**
 * @fileOverview Creates an intelligent shopping list by consolidating ingredients from a meal plan and grouping them into categories.
 *
 * - createSmartShoppingList - A function that takes a meal plan as input and returns a categorized shopping list.
 * - CreateSmartShoppingListInput - The input type for the createSmartShoppingList function.
 * - CreateSmartShoppingListOutput - The return type for the createSmartShoppingList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateSmartShoppingListInputSchema = z.object({
  mealPlan: z.string().describe('The weekly meal plan in text format.'),
});
export type CreateSmartShoppingListInput = z.infer<
  typeof CreateSmartShoppingListInputSchema
>;

const CreateSmartShoppingListOutputSchema = z.object({
  shoppingList: z
    .string()
    .describe('The categorized shopping list generated from the meal plan.'),
});
export type CreateSmartShoppingListOutput = z.infer<
  typeof CreateSmartShoppingListOutputSchema
>;

export async function createSmartShoppingList(
  input: CreateSmartShoppingListInput
): Promise<CreateSmartShoppingListOutput> {
  return createSmartShoppingListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createSmartShoppingListPrompt',
  input: {schema: CreateSmartShoppingListInputSchema},
  output: {schema: CreateSmartShoppingListOutputSchema},
  prompt: `Eres un asistente personal especializado en crear listas de compras a partir de planes de comidas.

  Dado el siguiente plan de comidas, crea una lista de compras que consolide los ingredientes y los agrupe en categorías útiles como "frutas y verduras", "lácteos", "carnes", etc.

  Plan de Comidas:
  {{mealPlan}}
  `,
});

const createSmartShoppingListFlow = ai.defineFlow(
  {
    name: 'createSmartShoppingListFlow',
    inputSchema: CreateSmartShoppingListInputSchema,
    outputSchema: CreateSmartShoppingListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
