import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { useProductContext, Category } from "@/contexts/ProductContext";

export default function CategoryManager() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getProductsByCategory
  } = useProductContext();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "product" as "product" | "service"
  });

  const handleAddCategory = () => {
    if (!formData.name.trim()) {
      toast.error("Le nom de la catégorie est requis");
      return;
    }

    const categoryData = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      color: formData.type === "product"
        ? "bg-blue-100 text-blue-800"
        : "bg-purple-100 text-purple-800"
    };

    try {
      addCategory(categoryData);
      setFormData({ name: "", description: "", type: "product" });
      setOpenDialog(false);

      toast.success("Catégorie ajoutée", {
        description: `La catégorie "${categoryData.name}" a été créée avec succès`
      });
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Erreur lors de l'ajout de la catégorie");
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      type: category.type
    });
    setOpenDialog(true);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !formData.name.trim()) {
      toast.error("Le nom de la catégorie est requis");
      return;
    }

    const categoryData = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      color: formData.type === "product" 
        ? "bg-blue-100 text-blue-800" 
        : "bg-purple-100 text-purple-800"
    };

    updateCategory(editingCategory.id, categoryData);
    setEditingCategory(null);
    setFormData({ name: "", description: "", type: "product" });
    setOpenDialog(false);
    
    toast.success("Catégorie modifiée", {
      description: `La catégorie "${formData.name}" a été mise à jour`
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    const productsInCategory = getProductsByCategory(categoryId);
    
    if (productsInCategory.length > 0) {
      toast.error("Impossible de supprimer", {
        description: `Cette catégorie contient ${productsInCategory.length} produit(s). Veuillez d'abord les déplacer ou les supprimer.`
      });
      return;
    }
    
    deleteCategory(categoryId);
    toast.success("Catégorie supprimée", {
      description: `La catégorie "${category?.name}" a été supprimée`
    });
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", type: "product" });
    setEditingCategory(null);
  };



  const productCategories = categories.filter(cat => cat.type === "product");
  const serviceCategories = categories.filter(cat => cat.type === "service");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des catégories</h2>
          <p className="text-gray-600">Gérez les catégories de produits et services</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={openDialog} onOpenChange={(open) => {
            setOpenDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus size={16} />
                Nouvelle catégorie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory 
                    ? "Modifiez les informations de la catégorie"
                    : "Créez une nouvelle catégorie de produit ou service"
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de la catégorie</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Écrans tactiles"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description de la catégorie..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as "product" | "service" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Produit</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={editingCategory ? handleUpdateCategory : handleAddCategory}>
                  {editingCategory ? "Modifier" : "Créer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Catégories de produits */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Catégories de produits ({productCategories.length})
                </CardTitle>
                <CardDescription>
                  Catégories pour les équipements et matériels
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => {
                  setFormData({ name: "", description: "", type: "product" });
                  setEditingCategory(null);
                  setOpenDialog(true);
                }}
              >
                <Plus size={14} />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {productCategories.map((category) => {
              const productCount = getProductsByCategory(category.id).length;
              return (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={category.color}>
                        {category.name}
                      </Badge>
                      <span className="text-sm text-gray-500">({productCount} produits)</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            {productCategories.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Aucune catégorie de produit
              </p>
            )}
          </CardContent>
        </Card>

        {/* Catégories de services */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Catégories de services ({serviceCategories.length})
                </CardTitle>
                <CardDescription>
                  Catégories pour les services et prestations
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => {
                  setFormData({ name: "", description: "", type: "service" });
                  setEditingCategory(null);
                  setOpenDialog(true);
                }}
              >
                <Plus size={14} />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {serviceCategories.map((category) => {
              const productCount = getProductsByCategory(category.id).length;
              return (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={category.color}>
                        {category.name}
                      </Badge>
                      <span className="text-sm text-gray-500">({productCount} services)</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            {serviceCategories.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Aucune catégorie de service
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bouton flottant pour mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Button
          size="lg"
          className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white h-14 w-14"
          onClick={() => {
            setFormData({ name: "", description: "", type: "product" });
            setEditingCategory(null);
            setOpenDialog(true);
          }}
        >
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
}
