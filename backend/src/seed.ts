import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { recipes } from "./schema";

// Connect to the database
const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Sample recipe data
const sampleRecipes = [
  {
    title: "Classic Spaghetti Carbonara",
    ingredients: "400g spaghetti, 150g pancetta or guanciale, 3 large eggs, 75g Pecorino Romano cheese, 50g Parmesan cheese, 2 cloves garlic, Salt and black pepper to taste, Extra virgin olive oil",
    instructions: "1. Cook spaghetti in salted water according to package instructions until al dente.\n2. While pasta cooks, heat olive oil in a large pan and fry the pancetta until crispy.\n3. In a bowl, whisk eggs and grated cheeses together with black pepper.\n4. Drain pasta, reserving a cup of pasta water.\n5. Working quickly, add hot pasta to the pan with pancetta, remove from heat.\n6. Pour egg mixture over pasta, stirring constantly. Add a splash of pasta water to create a creamy sauce.\n7. Season with salt if needed and serve immediately with extra cheese and black pepper.",
    website_url: "https://www.example.com/carbonara",
    image_url: "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    title: "Homemade Margherita Pizza",
    ingredients: "For the dough: 500g '00' flour, 325ml lukewarm water, 7g dried yeast, 10g salt, 1 tbsp olive oil\nFor the topping: 400g can plum tomatoes, 2 garlic cloves, 1 tbsp olive oil, Fresh basil leaves, 250g fresh mozzarella, Salt and pepper to taste",
    instructions: "1. Mix flour, yeast, salt in a bowl. Add water and oil, knead for 10 minutes until smooth.\n2. Let dough rise for 2 hours in a warm place.\n3. Preheat oven to highest setting (240-275°C) with pizza stone if available.\n4. Blend tomatoes, garlic, oil, and salt for sauce.\n5. Divide dough into 2-3 balls, roll out thinly.\n6. Top with sauce, torn mozzarella, and basil.\n7. Bake for 8-10 minutes until crust is golden and cheese is bubbling.\n8. Drizzle with olive oil before serving.",
    website_url: "https://www.example.com/pizza",
    image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    title: "Thai Green Curry",
    ingredients: "400ml coconut milk, 4 tbsp green curry paste, 500g chicken breast, 1 tbsp fish sauce, 1 tbsp palm sugar, 2 kaffir lime leaves, 1 red chili, 100g green beans, 1 aubergine, Fresh Thai basil, Jasmine rice to serve",
    instructions: "1. Heat a little coconut milk in a large pan until it splits.\n2. Add curry paste and fry for 1-2 minutes until fragrant.\n3. Add chicken and stir to coat in the paste.\n4. Pour in remaining coconut milk, add lime leaves, and simmer for 15 minutes.\n5. Add vegetables and cook for another 5 minutes until tender.\n6. Season with fish sauce and palm sugar.\n7. Stir in Thai basil leaves just before serving.\n8. Serve with jasmine rice.",
    website_url: "https://www.example.com/thaicurry",
    image_url: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }
];

// Function to seed the database
async function seedDatabase() {
  console.log("Starting to seed database...");
  
  try {
    // Clear existing data (optional)
    await db.delete(recipes);
    console.log("Cleared existing recipes");
    
    // Insert sample recipes
    for (const recipe of sampleRecipes) {
      await db.insert(recipes).values(recipe);
      console.log(`Added recipe: ${recipe.title}`);
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the database connection
    await sql.end();
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();