import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Recipe } from "@/types/recipes";
import { ChevronLeft, Edit, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiService } from "@/config/api";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await apiService.get(`/api/recipes/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Recipe not found");
          }
          throw new Error("Failed to fetch recipe");
        }

        const data = await response.json();

        if (data.recipe) {
          setRecipe(data.recipe);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      const response = await apiService.delete(`/api/recipes/${id}`);

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Recipe deleted successfully");
        navigate("/recipes");
      } else {
        throw new Error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link to="/recipes">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Back to Recipes
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="space-y-6">
        <Link to="/recipes">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Back to Recipes
          </Button>
        </Link>
        <Alert>
          <AlertDescription>Recipe not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation and actions */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/recipes">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Back to Recipes
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link to={`/recipes/${id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" /> Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            className="gap-2 text-red-500 hover:text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Recipe header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
        <div className="flex flex-col gap-1 text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Added on {formatDate(recipe.created_at)}</span>
          </div>
          {recipe.updated_at && recipe.updated_at !== recipe.created_at && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Updated on {formatDate(recipe.updated_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Recipe website link */}
      {recipe.website_url && (
        <div className="mb-6">
          <a
            href={recipe.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            View Original Recipe
          </a>
        </div>
      )}

      {/* Recipe image */}
      {recipe.image_url ? (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-auto object-cover max-h-[400px]"
          />
        </div>
      ) : recipe.imageUrl ? (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-auto object-cover max-h-[400px]"
          />
        </div>
      ) : (
        <div className="mb-8 rounded-lg bg-muted flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No image available</p>
        </div>
      )}

      {/* Recipe content */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <div className="whitespace-pre-line">{recipe.ingredients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="whitespace-pre-line">{recipe.instructions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the recipe "{recipe.title}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
