'use server';

/**
 * @fileOverview Flow for generating a personalized weekly meal plan based on user preferences, restrictions, and goals.
 *
 * - generateMealPlan - A function that handles the meal plan generation process.
 * - GenerateMealPlanInput - The input type for the generateMealPlan function.
 * - GenerateMealPlanOutput - The return type for the generateMealPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMealPlanInputSchema = z.object({
  dietaryPreferences: z
    .string()
    .describe('The user\'s dietary preferences (e.g., vegetarian, vegan, pescatarian).'),
  restrictions: z
    .string()
    .describe('Any dietary restrictions the user has (e.g., allergies, intolerances).'),
  goals: z
    .string()
    .describe('The user\'s health and fitness goals (e.g., weight loss, muscle gain).'),
  budget: z.number().describe('The user\'s weekly budget for meals in COP.'),
});
export type GenerateMealPlanInput = z.infer<typeof GenerateMealPlanInputSchema>;

const GenerateMealPlanOutputSchema = z.object({
  mealPlan: z.string().describe('A personalized weekly meal plan.'),
  shoppingList: z.string().describe('A consolidated shopping list for the meal plan.'),
  costEstimate: z.string().describe('Estimated cost of the meal plan in COP.'),
});
export type GenerateMealPlanOutput = z.infer<typeof GenerateMealPlanOutputSchema>;

export async function generateMealPlan(input: GenerateMealPlanInput): Promise<GenerateMealPlanOutput> {
  return generateMealPlanFlow(input);
}

const mealPlanPrompt = ai.definePrompt({
  name: 'mealPlanPrompt',
  input: {schema: GenerateMealPlanInputSchema},
  output: {schema: GenerateMealPlanOutputSchema},
  prompt: `You are a nutrition expert designing a weekly meal plan for a user.

  Consider the user's dietary preferences: {{{dietaryPreferences}}}
  Consider the user's restrictions: {{{restrictions}}}
  Consider the user's goals: {{{goals}}}
  The user's budget is: {{{budget}}} COP.

  Generate a detailed weekly meal plan, a consolidated shopping list, and an estimated cost in COP.
  Make sure that the shopping list consolidates ingredients where possible (e.g. if two meals use onions, combine the amount of onions).

  Format the meal plan, shopping list and cost estimates in a human-readable format.

  Here is a sample shopping list. Note how similar items are combined:

  Produce:
  - 2 Onions
  - 2 Tomatoes
  - 1 head of Lettuce
  Dairy:
  - 1 gallon of Milk
  - 1 dozen Eggs
  Other:
  - ...
  `,
});

const generateMealPlanFlow = ai.defineFlow(
  {
    name: 'generateMealPlanFlow',
    inputSchema: GenerateMealPlanInputSchema,
    outputSchema: GenerateMealPlanOutputSchema,
  },
  async input => {
    const {output} = await mealPlanPrompt(input);
    return output!;
  }
);
