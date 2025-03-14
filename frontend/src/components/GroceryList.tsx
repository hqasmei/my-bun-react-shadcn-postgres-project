import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Edit, Plus, Save, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface GroceryItem {
  id: number;
  name: string;
  created_at: string;
}

export default function GroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all items
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/api/grocery");
      const data = await response.json();

      if (data.items) {
        setItems(data.items);
      } else {
        console.error("Unexpected response format:", data);
        setError("Unexpected response format from server");
        toast.error("Failed to fetch grocery items", {
          description: "Unexpected response format from server",
        });
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch grocery items");
      toast.error("Connection Error", {
        description: "Could not connect to the grocery service",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new item
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const response = await fetch("http://localhost:3001/api/grocery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItemName }),
      });

      const result = await response.json();

      if (result.item) {
        setItems([...items, result.item]);
        setNewItemName("");
        toast.success("Item Added", {
          description: `"${result.item.name}" has been added to your list`,
        });
      } else {
        console.error("Unexpected response format:", result);
        toast.error("Error", {
          description: "Failed to add item",
        });
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Error", {
        description: "Failed to add item",
      });
    }
  };

  // Update item
  const updateItem = async (id: number, newName: string) => {
    if (!newName.trim()) {
      setEditingItem(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/grocery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      const result = await response.json();

      if (result.item) {
        setItems(items.map((item) => (item.id === id ? result.item : item)));
        setEditingItem(null);
        toast.success("Item Updated", {
          description: `Item has been renamed to "${result.item.name}"`,
        });
      } else {
        console.error("Unexpected response format:", result);
        toast.error("Error", {
          description: "Failed to update item",
        });
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Error", {
        description: "Failed to update item",
      });
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingItem(null);
  };

  // Delete item
  const deleteItem = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/grocery/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setItems(items.filter((item) => item.id !== id));
        toast.success("Item Deleted", {
          description: "Item has been removed from your list",
        });
      } else {
        console.error("Unexpected response format:", result);
        toast.error("Error", {
          description: "Failed to delete item",
        });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error", {
        description: "Failed to delete item",
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
    fetchItems();
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Grocery List</span>
          <Badge variant="outline">{items.length} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add new item form */}
        <form onSubmit={addItem} className="mb-6 flex gap-2">
          <Input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add new item..."
            className="flex-1"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button type="submit" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add item</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>

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

        {/* Items table */}
        {!loading && items.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="hidden md:table-cell">Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {editingItem?.id === item.id ? (
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              name: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateItem(item.id, editingItem.name);
                            } else if (e.key === "Escape") {
                              cancelEditing();
                            }
                          }}
                          autoFocus
                          className="flex-1"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  updateItem(item.id, editingItem.name)
                                }
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Save</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={cancelEditing}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Cancel</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {formatDate(item.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingItem?.id !== item.id && (
                      <div className="flex justify-end gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingItem(item)}
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
                                onClick={() => deleteItem(item.id)}
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
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4">
              <div className="bg-muted rounded-full p-3">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium">No items yet</h3>
            <p className="text-muted-foreground mt-1">
              Add items to your grocery list using the form above
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
