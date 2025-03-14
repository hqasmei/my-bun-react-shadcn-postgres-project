import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Edit, Plus, Save, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  created_at: string;
}

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
  });
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);

  // Fetch all recipes
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/api/recipes");
      const data = await response.json();

      if (data.recipes) {
        setRecipes(data.recipes);
      } else {
        console.error("Unexpected response format:", data);
        setError("Unexpected response format from server");
        toast.error("Failed to fetch recipes", {
          description: "Unexpected response format from server",
        });
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError("Failed to fetch recipes");
      toast.error("Connection Error", {
        description: "Could not connect to the recipe service",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new recipe
  const addRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newRecipe.title.trim() ||
      !newRecipe.ingredients.trim() ||
      !newRecipe.instructions.trim()
    ) {
      toast.error("Missing Information", {
        description: "Please fill in all fields",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      });

      const result = await response.json();

      if (result.recipe) {
        setRecipes([...recipes, result.recipe]);
        setNewRecipe({
          title: "",
          ingredients: "",
          instructions: "",
        });
        setIsAddingRecipe(false);
        toast.success("Recipe Added", {
          description: `"${result.recipe.title}" has been added to your recipes`,
        });
      } else {
        console.error("Unexpected response format:", result);
        toast.error("Error", {
          description: "Failed to add recipe",
        });
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      toast.error("Error", {
        description: "Failed to add recipe",
      });
    }
  };

  // Update recipe
  const updateRecipe = async (id: number) => {
    if (
      !editingRecipe ||
      !editingRecipe.title.trim() ||
      !editingRecipe.ingredients.trim() ||
      !editingRecipe.instructions.trim()
    ) {
      setEditingRecipe(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingRecipe.title,
          ingredients: editingRecipe.ingredients,
          instructions: editingRecipe.instructions,
        }),
      });

      const result = await response.json();

      if (result.recipe) {
        setRecipes(recipes.map((recipe) => (recipe.id === id ? result.recipe : recipe)));
        setEditingRecipe(null);
        toast.success("Recipe Updated", {
          description: `"${result.recipe.title}" has been updated`,
        });
      } else {
        console.error("Unexpected response format:", result);
        toast.error("Error", {
          description: "Failed to update recipe",
        });
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Error", {
        description: "Failed to update recipe",
      });
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingRecipe(null);
  };

  // Delete recipe
  const deleteRecipe = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/recipes/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
        toast.success("Recipe Deleted", {
          description: "Recipe has been removed from your collection",
        });
      } else {
        console.error("Unexpected response format:", result);
        toast.error("Error", {
          description: "Failed to delete recipe",
        });
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Error", {
        description: "Failed to delete recipe",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>My Recipe Collection</span>
          <Badge variant="outline">{recipes.length} recipes</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add new recipe button */}
        {!isAddingRecipe && (
          <div className="mb-6">
            <Button onClick={() => setIsAddingRecipe(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add New Recipe
            </Button>
          </div>
        )}

        {/* Add new recipe form */}
        {isAddingRecipe && (
          <form onSubmit={addRecipe} className="mb-6 space-y-4 border p-4 rounded-md">
            <h3 className="text-lg font-medium">Add New Recipe</h3>
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Recipe Title
              </label>
              <Input
                id="title"
                type="text"
                value={newRecipe.title}
                onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
                placeholder="Enter recipe title..."
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium mb-1">
                Ingredients
              </label>
              <Textarea
                id="ingredients"
                value={newRecipe.ingredients}
                onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                placeholder="Enter ingredients (one per line)..."
                className="w-full min-h-[100px]"
              />
            </div>
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium mb-1">
                Instructions
              </label>
              <Textarea
                id="instructions"
                value={newRecipe.instructions}
                onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
                placeholder="Enter cooking instructions..."
                className="w-full min-h-[150px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddingRecipe(false);
                  setNewRecipe({
                    title: "",
                    ingredients: "",
                    instructions: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Recipe</Button>
            </div>
          </form>
        )}

        {/* Loading and error states */}
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Recipes list */}
        {!loading && recipes.length > 0 && (
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden">
                {editingRecipe?.id === recipe.id ? (
                  <div className="p-4 space-y-4">
                    <div>
                      <label
                        htmlFor={`edit-title-${recipe.id}`}
                        className="block text-sm font-medium mb-1"
                      >
                        Recipe Title
                      </label>
                      <Input
                        id={`edit-title-${recipe.id}`}
                        type="text"
                        value={editingRecipe.title}
                        onChange={(e) =>
                          setEditingRecipe({ ...editingRecipe, title: e.target.value })
                        }
                        className="w-full"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-ingredients-${recipe.id}`}
                        className="block text-sm font-medium mb-1"
                      >
                        Ingredients
                      </label>
                      <Textarea
                        id={`edit-ingredients-${recipe.id}`}
                        value={editingRecipe.ingredients}
                        onChange={(e) =>
                          setEditingRecipe({ ...editingRecipe, ingredients: e.target.value })
                        }
                        className="w-full min-h-[100px]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-instructions-${recipe.id}`}
                        className="block text-sm font-medium mb-1"
                      >
                        Instructions
                      </label>
                      <Textarea
                        id={`edit-instructions-${recipe.id}`}
                        value={editingRecipe.instructions}
                        onChange={(e) =>
                          setEditingRecipe({ ...editingRecipe, instructions: e.target.value })
                        }
                        className="w-full min-h-[150px]"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={cancelEditing}>
                        <X className="h-4 w-4 mr-2" /> Cancel
                      </Button>
                      <Button onClick={() => updateRecipe(recipe.id)}>
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{recipe.title}</CardTitle>
                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingRecipe(recipe)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteRecipe(recipe.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Added on {formatDate(recipe.created_at)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Ingredients:</h4>
                        <div className="whitespace-pre-line text-sm">{recipe.ingredients}</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Instructions:</h4>
                        <div className="whitespace-pre-line text-sm">{recipe.instructions}</div>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && recipes.length === 0 && (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4">
              <div className="bg-muted rounded-full p-3">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium">No recipes yet</h3>
            <p className="text-muted-foreground mt-1">
              Add your first recipe to start your collection
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
