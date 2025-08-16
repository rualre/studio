# **App Name**: NutriGenius

## Core Features:

- Authentication: User authentication via email/Google using Firebase Auth.
- Preference Input: Form to collect user dietary preferences, restrictions, and goals.
- Meal Plan Generation: Generates a personalized weekly meal plan using OpenAI GPT-4o tool, considering user preferences and dietary needs.
- Cost Estimation: Estimates the total cost of the meal plan based on average prices in Colombia.
- Smart Shopping List: Creates an intelligent shopping list by consolidating all ingredients from the weekly meal plan. It's the LLM's decision when/if to combine the amounts of different items that happen to have the same ingredients. This list groups the ingredients into useful shopping categories, such as 'produce,' 'dairy,' and so on.
- Plan Display: Displays the generated meal plan and shopping list in an organized, easy-to-read format.
- Data Storage: Secure storage of user data, meal plans, and shopping lists using Firestore.

## Style Guidelines:

- Primary color: Light green (#A7D1AB) for a fresh and healthy feel.
- Background color: Very light green (#F0FAF2) for a clean and airy aesthetic.
- Accent color: Muted orange (#E5B482) to highlight important actions and information.
- Body and headline font: 'PT Sans', a humanist sans-serif, for readability and a touch of warmth.
- Use clean, minimalist icons to represent food groups, dietary restrictions, and meal types.
- Design a simple, intuitive layout that is easy to navigate and focus on meal plan content.
- Subtle transitions and animations to enhance user experience without being distracting.