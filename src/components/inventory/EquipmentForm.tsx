
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  }),
  serialNumber: z.string().min(1, {
    message: "Le numéro de série est requis",
  }),
  category: z.string({
    required_error: "Veuillez sélectionner une catégorie",
  }),
  status: z.string({
    required_error: "Veuillez sélectionner un statut",
  }),
  purchaseDate: z.string().min(1, {
    message: "La date d'achat est requise",
  }),
  purchasePrice: z.string().min(1, {
    message: "Le prix d'achat est requis",
  }),
  location: z.string().min(1, {
    message: "L'emplacement est requis",
  }),
  notes: z.string().optional(),
});

type EquipmentFormValues = z.infer<typeof formSchema>;

export function EquipmentForm({ 
  open, 
  onOpenChange, 
  onAddEquipment 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onAddEquipment: (data: any) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      category: "ecran",
      status: "disponible",
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: "",
      location: "Entrepôt principal",
      notes: "",
    },
  });

  function onSubmit(data: EquipmentFormValues) {
    setIsSubmitting(true);
    
    try {
      // Ajouter l'équipement
      onAddEquipment({
        ...data,
        purchasePrice: parseFloat(data.purchasePrice)
      });
      
      // Réinitialiser le formulaire
      form.reset();
      
      // Fermer le dialogue
      onOpenChange(false);
      
      toast.success("Équipement ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'équipement");
      console.error("Erreur d'ajout d'équipement:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un équipement</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour ajouter un nouvel équipement à l'inventaire.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'équipement</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Écran tactile 32 pouces" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de série</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: SCR2025-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ecran">Écran</SelectItem>
                        <SelectItem value="borne">Borne interactive</SelectItem>
                        <SelectItem value="projecteur">Projecteur</SelectItem>
                        <SelectItem value="tablette">Tablette</SelectItem>
                        <SelectItem value="accessoire">Accessoire</SelectItem>
                        <SelectItem value="cable">Câble</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'achat</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix d'achat (MAD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 15000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="disponible">Disponible</SelectItem>
                        <SelectItem value="reserve">Réservé</SelectItem>
                        <SelectItem value="en_utilisation">En utilisation</SelectItem>
                        <SelectItem value="maintenance">En maintenance</SelectItem>
                        <SelectItem value="hors_service">Hors service</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emplacement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un emplacement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Entrepôt principal">Entrepôt principal</SelectItem>
                        <SelectItem value="Showroom">Showroom</SelectItem>
                        <SelectItem value="Bureau">Bureau</SelectItem>
                        <SelectItem value="Véhicule">Véhicule de transport</SelectItem>
                        <SelectItem value="Client">Chez un client</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informations supplémentaires sur l'équipement" 
                      className="resize-none h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Ajout en cours..." : "Ajouter l'équipement"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
