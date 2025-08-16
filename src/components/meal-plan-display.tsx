"use client";

import type { GenerateMealPlanOutput } from "@/ai/flows/generate-meal-plan";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type MealPlanDisplayProps = {
  data: GenerateMealPlanOutput;
};

const ParsedContent = ({ content }: { content: string }) => {
  if (!content) return null;

  const lines = content.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="prose prose-sm max-w-none text-card-foreground">
      {lines.map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-6 mb-2">{trimmedLine.substring(4)}</h3>;
        }
        if (trimmedLine.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 border-b pb-2">{trimmedLine.substring(3)}</h2>;
        }
        if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
          return <h4 key={index} className="text-lg font-semibold mt-4 mb-1">{trimmedLine.substring(2, trimmedLine.length - 2)}</h4>;
        }
        if (trimmedLine.endsWith(':')) {
           return <h4 key={index} className="text-lg font-semibold mt-4 mb-1">{trimmedLine}</h4>;
        }
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          return <p key={index} className="ml-4">&bull; {trimmedLine.substring(2)}</p>;
        }
        return <p key={index}>{trimmedLine}</p>;
      })}
    </div>
  );
};

export function MealPlanDisplay({ data }: MealPlanDisplayProps) {
  const { mealPlan, shoppingList, costEstimate } = data;
  
  const formattedCost = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(costEstimate.replace(/[^0-9.-]+/g,"")) || 0);


  return (
    <Card className="shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your Personalized Plan is Ready!</CardTitle>
        <CardDescription>
          Here is your weekly meal plan and shopping list.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="meal-plan" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="meal-plan">Meal Plan</TabsTrigger>
            <TabsTrigger value="shopping-list">Shopping List</TabsTrigger>
          </TabsList>
          <TabsContent value="meal-plan" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <ParsedContent content={mealPlan} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="shopping-list" className="mt-4">
            <Card>
              <CardContent className="p-6">
                 <ParsedContent content={shoppingList} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
       <CardFooter>
          <div className="w-full text-center">
            <p className="text-muted-foreground text-sm">Estimated Weekly Cost</p>
            <p className="text-3xl font-bold text-primary">{formattedCost}</p>
          </div>
        </CardFooter>
    </Card>
  );
}
