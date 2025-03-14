import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Recipe } from "@/types/recipes";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe>({
    id: 0,
    title: "",
    ingredients: "",
    instructions: "",
    imageUrl: "",
    website_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3001/api/recipes/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Recipe not found");
          }
          throw new Error("Failed to fetch recipe");
        }

        const data = await response.json();

        if (data.recipe) {
          setRecipe(data.recipe);
          if (data.recipe.imageUrl) {
            setPreviewImage(data.recipe.imageUrl);
          }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Please select an image smaller than 5MB",
      });
      return;
    }

    // Create a preview URL
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);

    // In a real app, you would upload the image to a server or convert to base64
    // For this example, we'll simulate storing the image locally
    const reader = new FileReader();
    reader.onloadend = () => {
      setRecipe({
        ...recipe,
        imageUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreviewImage(null);
    setRecipe({
      ...recipe,
      imageUrl: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipe.title.trim() || !recipe.ingredients.trim() || !recipe.instructions.trim()) {
      toast.error("Missing information", {
        description: "Please fill in all required fields",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`http://localhost:3001/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...recipe,
          image_url: recipe.imageUrl, // Map to backend field name
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      const data = await response.json();

      if (data.recipe) {
        toast.success("Recipe updated", {
          description: (
            <div className="text-primary">"{data.recipe.title}" has been updated successfully</div>
          ),
        });
        navigate(`/recipes/${data.recipe.id}`);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe", {
        description: "Please try again later",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link to="/recipes">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Back to Recipes
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <div className="flex justify-end gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link to="/recipes">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Back to Recipes
            </Button>
          </Link>
        </div>
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/recipes")}>Return to Recipes</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to={`/recipes/${id}`}>
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Back to Recipe
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Recipe Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={recipe.title}
                onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
                placeholder="Enter recipe title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL (Optional)</Label>
              <Input
                id="website_url"
                type="url"
                value={recipe.website_url || ""}
                onChange={(e) => setRecipe({ ...recipe, website_url: e.target.value })}
                placeholder="https://example.com/recipe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Recipe Image (Optional)</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image")?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" /> {previewImage ? "Change Image" : "Upload Image"}
                </Button>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {previewImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearImage}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                )}
              </div>
              {previewImage && (
                <div className="mt-4 relative rounded-md overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Recipe preview"
                    className="max-h-[200px] w-auto object-contain"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">
                Ingredients <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="ingredients"
                value={recipe.ingredients}
                onChange={(e) => setRecipe({ ...recipe, ingredients: e.target.value })}
                placeholder="Enter ingredients (one per line)"
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">
                Instructions <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="instructions"
                value={recipe.instructions}
                onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
                placeholder="Enter step-by-step instructions"
                rows={8}
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(`/recipes/${id}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
