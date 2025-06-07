
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
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
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import CategoryManager from "./CategoryManager";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface Category {
  id: string;
  name: string;
  type: 'equipment' | 'service';
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
}

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
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Écrans tactiles', type: 'equipment', description: 'Écrans interactifs', icon: 'Monitor', color: 'blue', isActive: true },
    { id: '2', name: 'Bornes interactives', type: 'equipment', description: 'Bornes libre-service', icon: 'Tablet', color: 'green', isActive: true },
    { id: '3', name: 'Projecteurs', type: 'equipment', description: 'Projecteurs interactifs', icon: 'Projector', color: 'purple', isActive: true },
    { id: '4', name: 'Installation', type: 'service', description: 'Service d\'installation', icon: 'Wrench', color: 'orange', isActive: true },
    { id: '5', name: 'Maintenance', type: 'service', description: 'Service de maintenance', icon: 'Wrench', color: 'red', isActive: true },
  ]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Informations générales</h3>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Nom de l'équipement/service</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Écran tactile 32 pouces"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Numéro de série/référence</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: SCR2025-001"
                      className="h-10"
                      {...field}
                    />
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
                  <FormLabel className="flex items-center justify-between text-sm font-medium">
                    Catégorie
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCategoryManager(true)}
                      className="h-6 px-2 text-xs"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Gérer
                    </Button>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.filter(cat => cat.isActive).map((category) => (
                        <SelectItem key={category.id} value={category.name.toLowerCase()}>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${
                              category.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                              category.color === 'green' ? 'bg-green-100 text-green-800' :
                              category.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                              category.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                              category.color === 'red' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {category.type === 'equipment' ? 'Équip.' : 'Service'}
                            </Badge>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Informations financières</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Date d'achat/création</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-10"
                      {...field}
                    />
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
                  <FormLabel className="text-sm font-medium">Prix d'achat/coût (MAD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ex: 15000"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Statut et localisation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="loué">Loué</SelectItem>
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
                  <FormLabel className="text-sm font-medium">Emplacement</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Entrepôt principal, Bureau Casablanca..."
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Informations complémentaires</h3>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Informations supplémentaires, spécifications techniques, état, etc..."
                    className="resize-none h-24 min-h-[96px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 px-6"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-6"
          >
            {isSubmitting ? "Ajout en cours..." : "Ajouter l'équipement"}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold">Ajouter un équipement/service</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Remplissez les informations pour ajouter un nouvel élément à l'inventaire.
              </DialogDescription>
            </DialogHeader>
            <FormContent />
          </DialogContent>
        </Dialog>

        <CategoryManager
          open={showCategoryManager}
          onOpenChange={setShowCategoryManager}
          categories={categories}
          onCategoriesChange={setCategories}
        />
      </>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[95vh]">
          <DrawerHeader className="pb-4">
            <DrawerTitle className="text-lg font-semibold">Ajouter un équipement/service</DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground">
              Remplissez les informations pour ajouter un nouvel élément à l'inventaire.
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4">
            <FormContent />
          </div>
        </DrawerContent>
      </Drawer>

      <CategoryManager
        open={showCategoryManager}
        onOpenChange={setShowCategoryManager}
        categories={categories}
        onCategoriesChange={setCategories}
      />
    </>
  );
}
