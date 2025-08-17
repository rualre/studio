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
  prompt: `Eres un experto en nutrición diseñando un plan de comidas semanal para un usuario en Colombia.

  Considera las preferencias dietéticas del usuario: {{{dietaryPreferences}}}
  Considera las restricciones del usuario: {{{restrictions}}}
  Considera las metas del usuario: {{{goals}}}
  El presupuesto del usuario es: {{{budget}}} COP.

  Genera un plan de comidas semanal detallado, una lista de compras consolidada y un costo estimado en COP.
  Asegúrate de que la lista de compras consolide los ingredientes cuando sea posible (por ejemplo, si dos comidas usan cebollas, combina la cantidad de cebollas).
  Basa tus respuestas en alimentos y productos que se encuentran comúnmente en Colombia.

  Formatea el plan de comidas, la lista de compras y las estimaciones de costos en un formato legible para humanos.

  Aquí tienes una lista de compras de ejemplo. Observa cómo se combinan los artículos similares:

  Frutas y Verduras:
  - 2 Cebollas
  - 2 Tomates
  - 1 cabeza de Lechuga
  Lácteos:
  - 1 galón de Leche
  - 1 docena de Huevos
  Otros:
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
