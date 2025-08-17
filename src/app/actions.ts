"use server";

import { z } from "zod";
import {
  generateMealPlan,
  type GenerateMealPlanOutput,
} from "@/ai/flows/generate-meal-plan";

const formSchema = z.object({
  dietaryPreferences: z.string().min(1, "Las preferencias dietéticas son obligatorias."),
  restrictions: z.string().min(1, 'Por favor, indique restricciones o "ninguna".'),
  goals: z.string().min(1, "Los objetivos son obligatorios."),
  budget: z.coerce.number().min(0, "El presupuesto debe ser un número positivo."),
  weight: z.coerce.number().positive("El peso debe ser un número positivo."),
  height: z.coerce.number().positive("La altura debe ser un número positivo."),
  bodyType: z.string().min(1, "El tipo de cuerpo es obligatorio."),
  bodyFatPercentage: z.coerce.number().optional(),
});

type MealPlanState = {
  data: GenerateMealPlanOutput | null;
  error: string | null;
};

export async function generatePlanAction(
  input: z.infer<typeof formSchema>
): Promise<MealPlanState> {
  const validatedFields = formSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      data: null,
      error: "Entrada no válida. Por favor, compruebe los campos del formulario.",
    };
  }

  try {
    const result = await generateMealPlan(validatedFields.data);
    return { data: result, error: null };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: "Se ha producido un error inesperado. Por favor, inténtelo de nuevo más tarde.",
    };
  }
}
