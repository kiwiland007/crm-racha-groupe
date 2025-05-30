import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Wrench,
  Monitor,
  Tablet,
  Smartphone,
  Projector,
  Camera,
  Headphones,
  Printer,
  Router,
  Server
} from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  type: 'equipment' | 'service';
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
}

interface CategoryManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

const ICON_OPTIONS = [
  { value: 'Monitor', label: 'Écran', icon: Monitor },
  { value: 'Tablet', label: 'Tablette', icon: Tablet },
  { value: 'Smartphone', label: 'Smartphone', icon: Smartphone },
  { value: 'Projector', label: 'Projecteur', icon: Projector },
  { value: 'Camera', label: 'Caméra', icon: Camera },
  { value: 'Headphones', label: 'Audio', icon: Headphones },
  { value: 'Printer', label: 'Imprimante', icon: Printer },
  { value: 'Router', label: 'Réseau', icon: Router },
  { value: 'Server', label: 'Serveur', icon: Server },
  { value: 'Package', label: 'Équipement', icon: Package },
  { value: 'Wrench', label: 'Service', icon: Wrench },
];

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Bleu', class: 'bg-blue-100 text-blue-800' },
  { value: 'green', label: 'Vert', class: 'bg-green-100 text-green-800' },
  { value: 'purple', label: 'Violet', class: 'bg-purple-100 text-purple-800' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-100 text-orange-800' },
  { value: 'red', label: 'Rouge', class: 'bg-red-100 text-red-800' },
  { value: 'yellow', label: 'Jaune', class: 'bg-yellow-100 text-yellow-800' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-100 text-indigo-800' },
  { value: 'pink', label: 'Rose', class: 'bg-pink-100 text-pink-800' },
];

export default function InventoryCategoryManager({ open, onOpenChange, categories, onCategoriesChange }: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'equipment' as 'equipment' | 'service',
    description: '',
    icon: 'Package',
    color: 'blue'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'equipment',
      description: '',
      icon: 'Package',
      color: 'blue'
    });
    setEditingCategory(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }

    const newCategory: Category = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.name.trim(),
      type: formData.type,
      description: formData.description.trim(),
      icon: formData.icon,
      color: formData.color,
      isActive: true
    };

    if (editingCategory) {
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategory.id ? newCategory : cat
      );
      onCategoriesChange(updatedCategories);
      toast.success('Catégorie modifiée avec succès');
    } else {
      onCategoriesChange([...categories, newCategory]);
      toast.success('Catégorie ajoutée avec succès');
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      description: category.description,
      icon: category.icon,
      color: category.color
    });
    setShowForm(true);
  };

  const handleDelete = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    onCategoriesChange(updatedCategories);
    toast.success('Catégorie supprimée');
  };

  const toggleActive = (categoryId: string) => {
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    );
    onCategoriesChange(updatedCategories);
  };

  const getIcon = (iconName: string) => {
    const iconOption = ICON_OPTIONS.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Package;
  };

  const getColorClass = (color: string) => {
    const colorOption = COLOR_OPTIONS.find(opt => opt.value === color);
    return colorOption ? colorOption.class : 'bg-blue-100 text-blue-800';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">Gestion des catégories</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Organisez votre inventaire en créant et gérant des catégories d'équipements et de services.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header avec bouton d'ajout */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Catégories existantes</h3>
              <p className="text-sm text-muted-foreground">
                Gérez les catégories d'équipements et de services
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle catégorie
            </Button>
          </div>

          {/* Liste des catégories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const IconComponent = getIcon(category.icon);
              return (
                <Card key={category.id} className={`${!category.isActive ? 'opacity-50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        <CardTitle className="text-base">{category.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getColorClass(category.color)}>
                          {category.type === 'equipment' ? 'Équipement' : 'Service'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(category.id)}
                          className="h-6 text-xs"
                        >
                          {category.isActive ? 'Actif' : 'Inactif'}
                        </Button>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Formulaire d'ajout/édition */}
          {showForm && (
            <Card className="border-2 border-dashed">
              <CardHeader>
                <CardTitle>
                  {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value: 'equipment' | 'service') => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equipment">Équipement</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="icon">Icône</Label>
                    <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color">Couleur</Label>
                    <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLOR_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${option.class}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (optionnelle)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description de la catégorie..."
                    className="resize-none h-20"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { resetForm(); setShowForm(false); }}>
                    Annuler
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingCategory ? 'Modifier' : 'Ajouter'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
