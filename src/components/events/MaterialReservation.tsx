import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Package, Calendar, MapPin, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useProductContext } from "@/contexts/ProductContext";

interface MaterialReservationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
  } | null;
  onReserve: (eventId: number, reservedMaterials: ReservedMaterial[]) => void;
}

interface ReservedMaterial {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  pricePerDay: number;
  totalPrice: number;
}

interface AvailableMaterial {
  id: string;
  name: string;
  category: string;
  availability: string;
  pricePerDay: number;
  stock: number;
}

export function MaterialReservation({ 
  open, 
  onOpenChange, 
  event, 
  onReserve 
}: MaterialReservationProps) {
  const { products, getCategoryById } = useProductContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [reservedMaterials, setReservedMaterials] = useState<ReservedMaterial[]>([]);

  // Convertir les produits en matériel disponible
  const availableMaterials: AvailableMaterial[] = products
    .filter(product => product.availability === "en_stock")
    .map(product => ({
      id: product.id,
      name: product.name,
      category: getCategoryById(product.category)?.name || product.category,
      availability: product.availability,
      pricePerDay: parseInt(product.price.rental) || 0,
      stock: Math.floor(Math.random() * 10) + 1 // Simulation du stock
    }));

  // Filtrer les matériaux
  const filteredMaterials = availableMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtenir les catégories uniques
  const categories = Array.from(new Set(availableMaterials.map(m => m.category)));

  const addToReservation = (material: AvailableMaterial) => {
    const existing = reservedMaterials.find(r => r.productId === material.id);
    
    if (existing) {
      if (existing.quantity < material.stock) {
        setReservedMaterials(prev => prev.map(r => 
          r.productId === material.id 
            ? { 
                ...r, 
                quantity: r.quantity + 1,
                totalPrice: (r.quantity + 1) * r.pricePerDay
              }
            : r
        ));
      } else {
        toast.error("Stock insuffisant", {
          description: `Stock maximum disponible: ${material.stock}`
        });
      }
    } else {
      const newReservation: ReservedMaterial = {
        productId: material.id,
        productName: material.name,
        category: material.category,
        quantity: 1,
        pricePerDay: material.pricePerDay,
        totalPrice: material.pricePerDay
      };
      setReservedMaterials(prev => [...prev, newReservation]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const material = availableMaterials.find(m => m.id === productId);
    
    if (newQuantity <= 0) {
      setReservedMaterials(prev => prev.filter(r => r.productId !== productId));
    } else if (material && newQuantity <= material.stock) {
      setReservedMaterials(prev => prev.map(r => 
        r.productId === productId 
          ? { 
              ...r, 
              quantity: newQuantity,
              totalPrice: newQuantity * r.pricePerDay
            }
          : r
      ));
    } else {
      toast.error("Stock insuffisant");
    }
  };

  const removeFromReservation = (productId: string) => {
    setReservedMaterials(prev => prev.filter(r => r.productId !== productId));
  };

  const calculateTotal = () => {
    return reservedMaterials.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleReserve = () => {
    if (reservedMaterials.length === 0) {
      toast.error("Aucun matériel sélectionné");
      return;
    }

    if (event) {
      onReserve(event.id, reservedMaterials);
      toast.success("Matériel réservé", {
        description: `${reservedMaterials.length} équipement(s) réservé(s) pour ${event.title}`
      });
      setReservedMaterials([]);
      onOpenChange(false);
    }
  };

  const resetReservation = () => {
    setReservedMaterials([]);
    setSearchTerm("");
    setSelectedCategory("all");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetReservation();
    }}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Réservation de matériel
          </DialogTitle>
          <DialogDescription>
            {event && (
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{event.title}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>{event.startDate} - {event.endDate}</span>
                  <MapPin className="h-4 w-4 ml-2" />
                  <span>{event.location}</span>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-6">
          {/* Liste du matériel disponible */}
          <div className="flex-1 flex flex-col">
            <div className="space-y-4 mb-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher du matériel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 overflow-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matériel</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Prix/jour</TableHead>
                    <TableHead className="w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{material.category}</Badge>
                      </TableCell>
                      <TableCell>{material.stock}</TableCell>
                      <TableCell>{material.pricePerDay.toLocaleString()} MAD</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => addToReservation(material)}
                          disabled={reservedMaterials.find(r => r.productId === material.id)?.quantity >= material.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Panier de réservation */}
          <div className="w-96 flex flex-col border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Matériel sélectionné ({reservedMaterials.length})</h3>
            
            <div className="flex-1 overflow-auto space-y-2">
              {reservedMaterials.map((item) => (
                <div key={item.productId} className="border rounded p-3 space-y-2">
                  <div className="font-medium text-sm">{item.productName}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromReservation(item.productId)}
                    >
                      Retirer
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.pricePerDay.toLocaleString()} MAD/jour × {item.quantity} = {item.totalPrice.toLocaleString()} MAD
                  </div>
                </div>
              ))}
            </div>

            {reservedMaterials.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{calculateTotal().toLocaleString()} MAD/jour</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleReserve} disabled={reservedMaterials.length === 0}>
            Réserver le matériel ({reservedMaterials.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
