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
    .describe('Las preferencias dietéticas del usuario (ej. vegetariano, vegano, pescetariano).'),
  restrictions: z
    .string()
    .describe('Cualquier restricción dietética que tenga el usuario (ej. alergias, intolerancias).'),
  goals: z
    .string()
    .describe('Los objetivos de salud y fitness del usuario (ej. pérdida de peso, ganancia muscular).'),
  budget: z.number().describe('El presupuesto semanal del usuario para comidas en COP.'),
  weight: z.number().describe('El peso del usuario en kilogramos.'),
  height: z.number().describe('La altura del usuario en centímetros.'),
  bodyType: z.string().describe('El tipo de cuerpo del usuario (ej. ectomorfo, mesomorfo, endomorfo).'),
  bodyFatPercentage: z.number().optional().describe('El porcentaje de grasa corporal del usuario (opcional).'),
});
export type GenerateMealPlanInput = z.infer<typeof GenerateMealPlanInputSchema>;

const GenerateMealPlanOutputSchema = z.object({
  mealPlan: z.string().describe('Un plan de comidas semanal personalizado.'),
  shoppingList: z.string().describe('Una lista de compras consolidada para el plan de comidas.'),
  costEstimate: z.string().describe('Costo estimado del plan de comidas en COP.'),
});
export type GenerateMealPlanOutput = z.infer<typeof GenerateMealPlanOutputSchema>;

export async function generateMealPlan(input: GenerateMealPlanInput): Promise<GenerateMealPlanOutput> {
  return generateMealPlanFlow(input);
}

const mealPlanPrompt = ai.definePrompt({
  name: 'mealPlanPrompt',
  input: {schema: GenerateMealPlanInputSchema},
  output: {schema: GenerateMealPlanOutputSchema},
  prompt: `Eres un nutricionista experto que diseña un plan de comidas semanal para un usuario en Colombia.

  Ten en cuenta los siguientes datos del usuario:
  - Preferencias dietéticas: {{{dietaryPreferences}}}
  - Restricciones: {{{restrictions}}}
  - Metas: {{{goals}}}
  - Presupuesto: {{{budget}}} COP
  - Peso: {{{weight}}} kg
  - Altura: {{{height}}} cm
  - Tipo de cuerpo: {{{bodyType}}}
  {{#if bodyFatPercentage}}- Porcentaje de grasa corporal: {{{bodyFatPercentage}}}%{{/if}}

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
