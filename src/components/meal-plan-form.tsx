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
  dietaryPreferences: z.string().min(3, "Please describe your dietary preferences (e.g., vegetarian, keto)."),
  restrictions: z.string().min(3, "List any restrictions or enter 'none'."),
  goals: z.string().min(3, "What are your health goals (e.g., weight loss, muscle gain)?"),
  budget: z.coerce.number({invalid_type_error: "Please enter a valid number."}).positive("Budget must be a positive number."),
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
                <FormLabel>Dietary Preferences</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Vegetarian, Low-carb" {...field} />
                </FormControl>
                <FormDescription>
                  What kind of food do you prefer?
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
                <FormLabel>Health Goals</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Weight loss, more energy" {...field} />
                </FormControl>
                <FormDescription>
                  What do you want to achieve?
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
              <FormLabel>Allergies & Restrictions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Peanuts, Gluten-free, none"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
               <FormDescription>
                  Any food you must avoid?
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
              <FormLabel>Weekly Budget (COP)</FormLabel>
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
              Generating...
            </>
          ) : (
            "Generate My Plan"
          )}
        </Button>
      </form>
    </Form>
  );
}
