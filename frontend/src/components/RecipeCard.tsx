import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Recipe } from "@/types/recipes";
import { CalendarIcon, Clock, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Get the image URL from either image_url or imageUrl
  const imageUrl = recipe.image_url || recipe.imageUrl;
  
  // Check if the recipe has been updated
  const hasBeenUpdated = recipe.updated_at && recipe.updated_at !== recipe.created_at;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/recipes/${recipe.id}/edit`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      setIsDeleting(true);
      
      try {
        const response = await fetch(`http://localhost:3001/api/recipes/${recipe.id}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          throw new Error("Failed to delete recipe");
        }
        
        toast.success("Recipe deleted", {
          description: `"${recipe.title}" has been removed from your collection`,
        });
        
        // Force a refresh of the page to update the recipe list
        window.location.reload();
      } catch (error) {
        console.error("Error deleting recipe:", error);
        toast.error("Failed to delete recipe", {
          description: "Please try again later",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="relative group">
      <Link to={`/recipes/${recipe.id}`} className="block">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <div className="aspect-video bg-muted relative">
              {imageUrl ? (
                <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg line-clamp-1">{recipe.title}</h3>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {recipe.ingredients.split("\n").length} ingredients
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span>{formatDate(recipe.created_at)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </Link>
      
      {/* Overlay with action buttons */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex flex-col justify-end p-4">
        <div className="flex justify-end gap-2 mb-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 px-3 bg-white/90 hover:bg-white border-none text-black font-medium shadow-md"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            className="h-9 px-3 font-medium shadow-md"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
