import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function AddRecipePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    imageUrl: "",
    website_url: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...recipe,
          image_url: recipe.imageUrl, // Map to backend field name
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }

      const data = await response.json();

      if (data.recipe) {
        toast.success("Recipe created", {
          description: `"${data.recipe.title}" has been added to your collection`,
        });
        navigate(`/recipes/${data.recipe.id}`);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast.error("Failed to create recipe", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <CardTitle>Add New Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Recipe Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={recipe.title}
                onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
                placeholder="Enter recipe name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL (Optional)</Label>
              <Input
                id="website_url"
                type="url"
                value={recipe.website_url}
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
                  <Upload className="h-4 w-4" /> Upload Image
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
              <Button type="button" variant="outline" onClick={() => navigate("/recipes")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Recipe"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
