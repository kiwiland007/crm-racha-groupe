import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Minus } from "lucide-react";

const formSchema = z.object({
  operation: z.enum(["add", "remove", "set"]),
  quantity: z.number().min(0, "La quantité doit être positive"),
  reason: z.string().min(1, "La raison est requise"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Equipment {
  id: number;
  name: string;
  category: string;
  status: string;
  quantity: number;
  location: string;
}

interface StockUpdateFormProps {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormValues & { id: number; newQuantity: number }) => void;
}

export function StockUpdateForm({ equipment, open, onOpenChange, onSave }: StockUpdateFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operation: "add",
      quantity: 1,
      reason: "",
      notes: "",
    },
  });

  const watchedOperation = form.watch("operation");
  const watchedQuantity = form.watch("quantity");

  // Calculer la nouvelle quantité
  const calculateNewQuantity = () => {
    if (!equipment) return 0;
    
    switch (watchedOperation) {
      case "add":
        return equipment.quantity + watchedQuantity;
      case "remove":
        return Math.max(0, equipment.quantity - watchedQuantity);
      case "set":
        return watchedQuantity;
      default:
        return equipment.quantity;
    }
  };

  // Réinitialiser le formulaire quand l'équipement change
  useEffect(() => {
    if (equipment && open) {
      form.reset({
        operation: "add",
        quantity: 1,
        reason: "",
        notes: "",
      });
    }
  }, [equipment, open, form]);

  const onSubmit = (data: FormValues) => {
    if (equipment) {
      const newQuantity = calculateNewQuantity();
      onSave({
        ...data,
        id: equipment.id,
        newQuantity,
      });
      onOpenChange(false);
    }
  };

  if (!equipment) return null;

  const newQuantity = calculateNewQuantity();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-6 w-6 text-blue-600" />
            Gestion du stock
          </DialogTitle>
          <DialogDescription className="text-base">
            Ajuster la quantité en stock pour <span className="font-semibold text-gray-900">{equipment.name}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Carte d'information équipement */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{equipment.name}</p>
                <p className="text-sm text-gray-600">{equipment.category}</p>
                <p className="text-xs text-gray-500">📍 {equipment.location}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Stock actuel</p>
              <Badge variant="outline" className="text-xl font-bold px-3 py-1 bg-white border-2 border-blue-300 text-blue-700">
                {equipment.quantity} unité{equipment.quantity > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Section Type d'opération avec cartes visuelles */}
            <div className="space-y-3">
              <FormLabel className="text-base font-semibold text-gray-900">Type d'opération</FormLabel>
              <FormField
                control={form.control}
                name="operation"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-3">
                        {/* Ajouter */}
                        <div
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            field.value === 'add'
                              ? 'border-green-500 bg-green-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-green-300'
                          }`}
                          onClick={() => field.onChange('add')}
                        >
                          <div className="text-center">
                            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                              field.value === 'add' ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              <Plus className={`h-6 w-6 ${field.value === 'add' ? 'text-green-600' : 'text-gray-500'}`} />
                            </div>
                            <p className={`font-medium text-sm ${field.value === 'add' ? 'text-green-700' : 'text-gray-700'}`}>
                              Ajouter
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Augmenter le stock</p>
                          </div>
                        </div>

                        {/* Retirer */}
                        <div
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            field.value === 'remove'
                              ? 'border-red-500 bg-red-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-red-300'
                          }`}
                          onClick={() => field.onChange('remove')}
                        >
                          <div className="text-center">
                            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                              field.value === 'remove' ? 'bg-red-100' : 'bg-gray-100'
                            }`}>
                              <Minus className={`h-6 w-6 ${field.value === 'remove' ? 'text-red-600' : 'text-gray-500'}`} />
                            </div>
                            <p className={`font-medium text-sm ${field.value === 'remove' ? 'text-red-700' : 'text-gray-700'}`}>
                              Retirer
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Diminuer le stock</p>
                          </div>
                        </div>

                        {/* Définir */}
                        <div
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            field.value === 'set'
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                          onClick={() => field.onChange('set')}
                        >
                          <div className="text-center">
                            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                              field.value === 'set' ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <Package className={`h-6 w-6 ${field.value === 'set' ? 'text-blue-600' : 'text-gray-500'}`} />
                            </div>
                            <p className={`font-medium text-sm ${field.value === 'set' ? 'text-blue-700' : 'text-gray-700'}`}>
                              Définir
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Fixer la quantité</p>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section Quantité avec indicateurs visuels */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-900">
                      {watchedOperation === "set" ? "Nouvelle quantité" :
                       watchedOperation === "add" ? "Quantité à ajouter" : "Quantité à retirer"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          placeholder={
                            watchedOperation === "set" ? "Ex: 10" :
                            watchedOperation === "add" ? "Ex: 5" : "Ex: 2"
                          }
                          className="text-lg font-semibold h-12 pl-12 pr-16"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          {watchedOperation === "add" && <Plus className="h-5 w-5 text-green-600" />}
                          {watchedOperation === "remove" && <Minus className="h-5 w-5 text-red-600" />}
                          {watchedOperation === "set" && <Package className="h-5 w-5 text-blue-600" />}
                        </div>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                          unité{field.value > 1 ? 's' : ''}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raison de la modification</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une raison" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Réception livraison">Réception livraison</SelectItem>
                      <SelectItem value="Vente">Vente</SelectItem>
                      <SelectItem value="Location">Location</SelectItem>
                      <SelectItem value="Retour location">Retour de location</SelectItem>
                      <SelectItem value="Maintenance">Envoi en maintenance</SelectItem>
                      <SelectItem value="Retour maintenance">Retour de maintenance</SelectItem>
                      <SelectItem value="Perte/Vol">Perte ou vol</SelectItem>
                      <SelectItem value="Inventaire">Correction d'inventaire</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Détails supplémentaires sur cette modification..."
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Aperçu du résultat amélioré */}
            <div className="space-y-4">
              {/* Calcul visuel */}
              <div className="p-5 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  {/* Stock actuel */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Stock actuel</p>
                    <div className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2">
                      <span className="text-xl font-bold text-gray-700">{equipment.quantity}</span>
                    </div>
                  </div>

                  {/* Opération */}
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      watchedOperation === 'add' ? 'bg-green-100' :
                      watchedOperation === 'remove' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {watchedOperation === "add" && <Plus className="h-6 w-6 text-green-600" />}
                      {watchedOperation === "remove" && <Minus className="h-6 w-6 text-red-600" />}
                      {watchedOperation === "set" && <span className="text-blue-600 font-bold">=</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {watchedOperation === "add" ? "Ajouter" :
                       watchedOperation === "remove" ? "Retirer" : "Définir"}
                    </p>
                  </div>

                  {/* Quantité */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Quantité</p>
                    <div className={`border-2 rounded-lg px-4 py-2 ${
                      watchedOperation === 'add' ? 'bg-green-50 border-green-300' :
                      watchedOperation === 'remove' ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'
                    }`}>
                      <span className={`text-xl font-bold ${
                        watchedOperation === 'add' ? 'text-green-700' :
                        watchedOperation === 'remove' ? 'text-red-700' : 'text-blue-700'
                      }`}>
                        {watchedQuantity || 0}
                      </span>
                    </div>
                  </div>

                  {/* Flèche */}
                  <div className="text-center">
                    <div className="text-2xl text-gray-400">→</div>
                  </div>

                  {/* Nouveau stock */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Nouveau stock</p>
                    <div className={`border-2 rounded-lg px-4 py-2 ${
                      newQuantity > equipment.quantity
                        ? 'bg-green-100 border-green-400'
                        : newQuantity < equipment.quantity
                        ? 'bg-red-100 border-red-400'
                        : 'bg-blue-100 border-blue-400'
                    }`}>
                      <span className={`text-xl font-bold ${
                        newQuantity > equipment.quantity
                          ? 'text-green-700'
                          : newQuantity < equipment.quantity
                          ? 'text-red-700'
                          : 'text-blue-700'
                      }`}>
                        {newQuantity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Résumé textuel */}
                <div className="text-center">
                  {newQuantity !== equipment.quantity && (
                    <p className={`text-sm font-medium ${
                      newQuantity > equipment.quantity ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {newQuantity > equipment.quantity
                        ? `+${newQuantity - equipment.quantity} unité${newQuantity - equipment.quantity > 1 ? 's' : ''} ajoutée${newQuantity - equipment.quantity > 1 ? 's' : ''}`
                        : `${equipment.quantity - newQuantity} unité${equipment.quantity - newQuantity > 1 ? 's' : ''} retirée${equipment.quantity - newQuantity > 1 ? 's' : ''}`
                      }
                    </p>
                  )}
                </div>

                {/* Alertes */}
                {newQuantity === 0 && (
                  <div className="mt-3 p-3 bg-amber-100 border border-amber-300 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-800">
                      <span className="text-lg">⚠️</span>
                      <span className="font-medium">Attention : Stock à zéro</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">
                      L'équipement ne sera plus disponible après cette opération.
                    </p>
                  </div>
                )}

                {watchedOperation === "remove" && newQuantity < 0 && (
                  <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <span className="text-lg">❌</span>
                      <span className="font-medium">Erreur : Stock négatif</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Impossible de retirer plus que le stock disponible.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Annuler
              </Button>
              <Button
                type="submit"
                className={`flex-1 ${
                  watchedOperation === 'add' ? 'bg-green-600 hover:bg-green-700' :
                  watchedOperation === 'remove' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={watchedOperation === "remove" && newQuantity < 0}
              >
                {watchedOperation === "add" && "✅ Ajouter au stock"}
                {watchedOperation === "remove" && "➖ Retirer du stock"}
                {watchedOperation === "set" && "📝 Définir la quantité"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
