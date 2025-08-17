"use client";

import * as React from "react";
import { Leaf, Loader2 } from "lucide-react";

import type { GenerateMealPlanOutput } from "@/ai/flows/generate-meal-plan";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MealPlanForm } from "@/components/meal-plan-form";
import { MealPlanDisplay } from "@/components/meal-plan-display";
import { generatePlanAction } from "@/app/actions";

type MealPlanState = {
  data: GenerateMealPlanOutput | null;
  error: string | null;
};

export default function Home() {
  const [isPending, startTransition] = React.useTransition();
  const [state, setState] = React.useState<MealPlanState>({
    data: null,
    error: null,
  });

  const handleSubmit = (formData: {
    dietaryPreferences: string;
    restrictions: string;
    goals: string;
    budget: number;
    weight: number;
    height: number;
    bodyType: string;
    bodyFatPercentage?: number;
  }) => {
    startTransition(async () => {
      const result = await generatePlanAction(formData);
      setState(result);
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 border-b bg-card shadow-sm">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold font-headline tracking-tight">
            NutriAsistente
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
        <section className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">
            Tu Asistente de Nutrición Personal con IA
          </h2>
          <p className="text-muted-foreground">
            Completa tus preferencias a continuación y deja que nuestra IA cree el plan de comidas semanal perfecto para ti.
          </p>
        </section>

        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <MealPlanForm onSubmit={handleSubmit} isPending={isPending} />
          </CardContent>
        </Card>

        {isPending && (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Creando tu plan personalizado...
            </p>
          </div>
        )}
        
        {state.error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-6">
              <p className="text-destructive-foreground font-medium text-center">{state.error}</p>
            </CardContent>
          </Card>
        )}

        {state.data && !isPending && (
          <MealPlanDisplay data={state.data} />
        )}
      </main>

      <footer className="w-full text-center p-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} NutriAsistente. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
