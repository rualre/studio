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
  prompt: `You are a personal assistant who specializes in creating shopping lists from meal plans.

  Given the following meal plan, create a shopping list that consolidates ingredients and groups them into useful shopping categories such as "produce", "dairy", "meat", etc.

  Meal Plan:
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
