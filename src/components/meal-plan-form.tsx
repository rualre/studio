"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  dietaryPreferences: z.string().min(3, "Por favor describe tus preferencias dietéticas (ej. vegetariano, keto)."),
  restrictions: z.string().min(3, "Enumera cualquier restricción o escribe 'ninguna'."),
  goals: z.string().min(3, "¿Cuáles son tus metas de salud (ej. perder peso, ganar músculo)?"),
  budget: z.coerce.number({invalid_type_error: "Por favor ingresa un número válido."}).positive("El presupuesto debe ser un número positivo."),
});

type MealPlanFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isPending: boolean;
};

export function MealPlanForm({ onSubmit, isPending }: MealPlanFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietaryPreferences: "",
      restrictions: "",
      goals: "",
      budget: 150000,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="dietaryPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferencias Dietéticas</FormLabel>
                <FormControl>
                  <Input placeholder="ej. Vegetariano, Bajo en carbohidratos" {...field} />
                </FormControl>
                <FormDescription>
                  ¿Qué tipo de comida prefieres?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metas de Salud</FormLabel>
                <FormControl>
                  <Input placeholder="ej. Perder peso, más energía" {...field} />
                </FormControl>
                <FormDescription>
                  ¿Qué quieres lograr?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="restrictions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alergias y Restricciones</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ej. Maní, Sin gluten, ninguna"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
               <FormDescription>
                  ¿Algún alimento que debas evitar?
                </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presupuesto Semanal (COP)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="150000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            "Generar Mi Plan"
          )}
        </Button>
      </form>
    </Form>
  );
}
