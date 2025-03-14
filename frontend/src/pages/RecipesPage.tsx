import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types/recipes";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3001/api/recipes");
        const data = await response.json();

        if (data.recipes) {
          setRecipes(data.recipes);
          setFilteredRecipes(data.recipes);
        } else {
          console.error("Unexpected response format:", data);
          setError("Unexpected response format from server");
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to fetch recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecipes(recipes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.ingredients.toLowerCase().includes(query) ||
          recipe.instructions.toLowerCase().includes(query)
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, recipes]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <Link to="/recipes/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Recipe
          </Button>
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search recipes by title, ingredients, or instructions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Recipe grid */}
      {!loading && filteredRecipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No recipes yet</h2>
          <p className="text-muted-foreground mb-6">
            Start building your collection by adding your first recipe.
          </p>
          <Link to="/recipes/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Your First Recipe
            </Button>
          </Link>
        </div>
      )}

      {/* No search results */}
      {!loading && recipes.length > 0 && filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No matching recipes</h2>
          <p className="text-muted-foreground mb-4">
            No recipes match your search query: "{searchQuery}"
          </p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}
