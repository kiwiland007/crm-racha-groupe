import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Package, 
  Settings, 
  Edit3,
  Check,
  X,
  Search
} from "lucide-react";
import { toast } from "sonner";

interface BLItem {
  id: string;
  type: 'produit' | 'service';
  designation: string;
  description?: string;
  quantiteCommandee: number;
  quantiteLivree: number;
  unite: string;
  prixUnitaire?: number;
  etat: 'neuf' | 'occasion' | 'reconditionne';
  numeroSerie?: string;
  observations?: string;
}

interface BLItemsManagerProps {
  items: BLItem[];
  onItemsChange: (items: BLItem[]) => void;
  readonly?: boolean;
}

interface PredefinedItem {
  type: 'produit' | 'service';
  designation: string;
  unite: string;
  description: string;
}

export function BLItemsManager({ items, onItemsChange, readonly = false }: BLItemsManagerProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<BLItem>>({
    type: 'produit',
    designation: '',
    description: '',
    quantiteCommandee: 1,
    quantiteLivree: 0,
    unite: 'pcs',
    etat: 'neuf',
    observations: ''
  });

  // Produits et services prédéfinis pour suggestions
  const predefinedItems = [
    // Produits
    { type: 'produit', designation: 'Écran tactile 55"', unite: 'pcs', description: 'Écran tactile interactif 55 pouces' },
    { type: 'produit', designation: 'Borne interactive 43"', unite: 'pcs', description: 'Borne tactile libre-service 43 pouces' },
    { type: 'produit', designation: 'Écran OLED transparent', unite: 'pcs', description: 'Écran OLED transparent haute définition' },
    { type: 'produit', designation: 'Support mural orientable', unite: 'pcs', description: 'Support mural pour écran tactile' },
    { type: 'produit', designation: 'Câble HDMI 5m', unite: 'pcs', description: 'Câble HDMI haute qualité 5 mètres' },
    { type: 'produit', designation: 'Clavier tactile étanche', unite: 'pcs', description: 'Clavier tactile résistant à l\'eau' },
    
    // Services
    { type: 'service', designation: 'Installation sur site', unite: 'h', description: 'Installation et configuration sur site client' },
    { type: 'service', designation: 'Formation utilisateur', unite: 'h', description: 'Formation à l\'utilisation des équipements' },
    { type: 'service', designation: 'Maintenance préventive', unite: 'intervention', description: 'Maintenance préventive annuelle' },
    { type: 'service', designation: 'Support technique', unite: 'h', description: 'Support technique à distance' },
    { type: 'service', designation: 'Calibrage écran', unite: 'intervention', description: 'Calibrage et optimisation écran tactile' },
    { type: 'service', designation: 'Mise à jour logicielle', unite: 'intervention', description: 'Mise à jour du logiciel système' }
  ];

  const filteredPredefined = predefinedItems.filter(item =>
    item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    if (!newItem.designation?.trim()) {
      toast.error("Veuillez saisir une désignation");
      return;
    }

    const item: BLItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: newItem.type as 'produit' | 'service',
      designation: newItem.designation,
      description: newItem.description || '',
      quantiteCommandee: newItem.quantiteCommandee || 1,
      quantiteLivree: newItem.quantiteLivree || 0,
      unite: newItem.unite || 'pcs',
      prixUnitaire: newItem.prixUnitaire || 0,
      etat: newItem.etat as 'neuf' | 'occasion' | 'reconditionne',
      numeroSerie: newItem.numeroSerie || '',
      observations: newItem.observations || ''
    };

    onItemsChange([...items, item]);
    
    // Reset form
    setNewItem({
      type: 'produit',
      designation: '',
      description: '',
      quantiteCommandee: 1,
      quantiteLivree: 0,
      unite: 'pcs',
      etat: 'neuf',
      observations: ''
    });
    setShowAddForm(false);
    
    toast.success("Article ajouté", {
      description: `${item.designation} ajouté au bon de livraison`
    });
  };

  const handleUpdateItem = (itemId: string, updates: Partial<BLItem>) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    onItemsChange(updatedItems);
    setEditingItem(null);
    
    toast.success("Article modifié", {
      description: "Les modifications ont été sauvegardées"
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    onItemsChange(updatedItems);
    
    toast.success("Article supprimé", {
      description: "L'article a été retiré du bon de livraison"
    });
  };

  const handleSelectPredefined = (predefined: PredefinedItem) => {
    setNewItem({
      ...newItem,
      type: predefined.type,
      designation: predefined.designation,
      description: predefined.description,
      unite: predefined.unite
    });
    setSearchTerm("");
  };

  const getTypeColor = (type: string) => {
    return type === 'produit' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  };

  const getEtatColor = (etat: string) => {
    switch (etat) {
      case 'neuf': return 'bg-green-100 text-green-800';
      case 'occasion': return 'bg-yellow-100 text-yellow-800';
      case 'reconditionne': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Articles à livrer ({items.length})
          </CardTitle>
          {!readonly && (
            <Button 
              onClick={() => setShowAddForm(!showAddForm)} 
              size="sm" 
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulaire d'ajout */}
        {showAddForm && !readonly && (
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Nouvel article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recherche dans les prédéfinis */}
              <div>
                <Label>Rechercher un article existant</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher produits/services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                {searchTerm && filteredPredefined.length > 0 && (
                  <div className="mt-2 max-h-32 overflow-y-auto border rounded-md">
                    {filteredPredefined.slice(0, 5).map((item, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSelectPredefined(item)}
                      >
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(item.type)}>
                            {item.type}
                          </Badge>
                          <span className="font-medium text-sm">{item.designation}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select 
                    value={newItem.type} 
                    onValueChange={(value) => setNewItem({...newItem, type: value as 'produit' | 'service'})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produit">Produit</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Désignation *</Label>
                  <Input
                    value={newItem.designation}
                    onChange={(e) => setNewItem({...newItem, designation: e.target.value})}
                    placeholder="Nom de l'article"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Description détaillée"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Qté commandée</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newItem.quantiteCommandee}
                    onChange={(e) => setNewItem({...newItem, quantiteCommandee: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div>
                  <Label>Qté livrée</Label>
                  <Input
                    type="number"
                    min="0"
                    value={newItem.quantiteLivree}
                    onChange={(e) => setNewItem({...newItem, quantiteLivree: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label>Unité</Label>
                  <Select 
                    value={newItem.unite} 
                    onValueChange={(value) => setNewItem({...newItem, unite: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pièces</SelectItem>
                      <SelectItem value="h">Heures</SelectItem>
                      <SelectItem value="intervention">Intervention</SelectItem>
                      <SelectItem value="m">Mètres</SelectItem>
                      <SelectItem value="kg">Kilogrammes</SelectItem>
                      <SelectItem value="lot">Lot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>État</Label>
                  <Select 
                    value={newItem.etat} 
                    onValueChange={(value) => setNewItem({...newItem, etat: value as 'neuf' | 'occasion' | 'reconditionne'})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neuf">Neuf</SelectItem>
                      <SelectItem value="occasion">Occasion</SelectItem>
                      <SelectItem value="reconditionne">Reconditionné</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddItem} size="sm" className="gap-2">
                  <Check className="h-4 w-4" />
                  Ajouter
                </Button>
                <Button 
                  onClick={() => setShowAddForm(false)} 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des articles */}
        {items.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Désignation</TableHead>
                  <TableHead>Qté Cmd.</TableHead>
                  <TableHead>Qté Livr.</TableHead>
                  <TableHead>Unité</TableHead>
                  <TableHead>État</TableHead>
                  {!readonly && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge className={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.designation}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.quantiteCommandee}</TableCell>
                    <TableCell>
                      {editingItem === item.id ? (
                        <Input
                          type="number"
                          min="0"
                          max={item.quantiteCommandee}
                          value={item.quantiteLivree}
                          onChange={(e) => handleUpdateItem(item.id, { quantiteLivree: parseInt(e.target.value) || 0 })}
                          className="w-20"
                        />
                      ) : (
                        <span className={item.quantiteLivree < item.quantiteCommandee ? 'text-orange-600' : 'text-green-600'}>
                          {item.quantiteLivree}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{item.unite}</TableCell>
                    <TableCell>
                      <Badge className={getEtatColor(item.etat)}>
                        {item.etat}
                      </Badge>
                    </TableCell>
                    {!readonly && (
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Aucun article ajouté</p>
            <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
