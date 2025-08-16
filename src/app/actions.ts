"use server";

import { z } from "zod";
import {
  generateMealPlan,
  type GenerateMealPlanOutput,
} from "@/ai/flows/generate-meal-plan";

const formSchema = z.object({
  dietaryPreferences: z.string().min(1, "Dietary preferences are required."),
  restrictions: z.string().min(1, 'Please state restrictions or "none".'),
  goals: z.string().min(1, "Goals are required."),
  budget: z.coerce.number().min(0, "Budget must be a positive number."),
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
      error: "Invalid input. Please check the form fields.",
    };
  }

  try {
    const result = await generateMealPlan(validatedFields.data);
    return { data: result, error: null };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
