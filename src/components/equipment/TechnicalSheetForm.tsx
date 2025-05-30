import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { Plus, X, Upload, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const technicalSheetSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  model: z.string().min(1, { message: "Le modèle est requis" }),
  brand: z.string().min(1, { message: "La marque est requise" }),
  category: z.string().min(1, { message: "La catégorie est requise" }),
  description: z.string().min(1, { message: "La description est requise" }),
  specifications: z.array(z.object({
    name: z.string().min(1, { message: "Le nom de la spécification est requis" }),
    value: z.string().min(1, { message: "La valeur est requise" }),
    unit: z.string().optional(),
  })),
  dimensions: z.object({
    length: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
  }),
  powerRequirements: z.object({
    voltage: z.string().optional(),
    power: z.string().optional(),
    frequency: z.string().optional(),
  }),
  connectivity: z.array(z.string()),
  operatingConditions: z.object({
    temperature: z.string().optional(),
    humidity: z.string().optional(),
  }),
  warranty: z.string().optional(),
  certifications: z.array(z.string()),
  accessories: z.array(z.string()),
  maintenanceNotes: z.string().optional(),
});

type TechnicalSheetFormValues = z.infer<typeof technicalSheetSchema>;

interface TechnicalSheetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: TechnicalSheetFormValues) => void;
  editingSheet?: any;
}

export function TechnicalSheetForm({
  open,
  onOpenChange,
  onSave,
  editingSheet
}: TechnicalSheetFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const isEditing = !!editingSheet;

  const form = useForm<TechnicalSheetFormValues>({
    resolver: zodResolver(technicalSheetSchema),
    defaultValues: {
      name: "",
      model: "",
      brand: "",
      category: "",
      description: "",
      specifications: [{ name: "", value: "", unit: "" }],
      dimensions: {
        length: "",
        width: "",
        height: "",
        weight: "",
      },
      powerRequirements: {
        voltage: "",
        power: "",
        frequency: "",
      },
      connectivity: [],
      operatingConditions: {
        temperature: "",
        humidity: "",
      },
      warranty: "",
      certifications: [],
      accessories: [],
      maintenanceNotes: "",
    },
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useForm({
    defaultValues: { specifications: [{ name: "", value: "", unit: "" }] }
  });

  const addSpecification = () => {
    const currentSpecs = form.getValues("specifications");
    form.setValue("specifications", [...currentSpecs, { name: "", value: "", unit: "" }]);
  };

  const removeSpecification = (index: number) => {
    const currentSpecs = form.getValues("specifications");
    form.setValue("specifications", currentSpecs.filter((_, i) => i !== index));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  function onSubmit(data: TechnicalSheetFormValues) {
    const sheetData = {
      ...data,
      images: images,
      id: isEditing ? editingSheet.id : Date.now().toString(),
      createdAt: isEditing ? editingSheet.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (onSave) {
      onSave(sheetData);
    }

    toast.success(
      isEditing ? "Fiche technique modifiée" : "Fiche technique créée",
      {
        description: `La fiche technique "${data.name}" a été ${isEditing ? "modifiée" : "créée"} avec succès.`,
      }
    );

    form.reset();
    setImages([]);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la fiche technique" : "Créer une fiche technique"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifier les informations de la fiche technique"
              : "Créer une fiche technique détaillée pour l'équipement"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'équipement</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'équipement" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modèle</FormLabel>
                        <FormControl>
                          <Input placeholder="Modèle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marque</FormLabel>
                        <FormControl>
                          <Input placeholder="Marque" {...field} />
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
                            <SelectItem value="ecran-tactile">Écran tactile</SelectItem>
                            <SelectItem value="borne-interactive">Borne interactive</SelectItem>
                            <SelectItem value="projecteur">Projecteur</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="eclairage">Éclairage</SelectItem>
                            <SelectItem value="accessoire">Accessoire</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description détaillée de l'équipement"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button type="button" variant="outline" className="gap-2" asChild>
                        <span>
                          <Upload size={16} />
                          Ajouter des images
                        </span>
                      </Button>
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => removeImage(index)}
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Spécifications techniques */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spécifications techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {form.watch("specifications").map((_, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg">
                      <FormField
                        control={form.control}
                        name={`specifications.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Résolution" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`specifications.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valeur</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 1920x1080" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`specifications.${index}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unité</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input placeholder="Ex: pixels" {...field} />
                              </FormControl>
                              {index > 0 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeSpecification(index)}
                                >
                                  <X size={16} />
                                </Button>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSpecification}
                    className="gap-2"
                  >
                    <Plus size={16} />
                    Ajouter une spécification
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dimensions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="dimensions.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longueur (mm)</FormLabel>
                        <FormControl>
                          <Input placeholder="1200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dimensions.width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Largeur (mm)</FormLabel>
                        <FormControl>
                          <Input placeholder="800" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dimensions.height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hauteur (mm)</FormLabel>
                        <FormControl>
                          <Input placeholder="50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dimensions.weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poids (kg)</FormLabel>
                        <FormControl>
                          <Input placeholder="25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Alimentation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alimentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="powerRequirements.voltage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tension</FormLabel>
                        <FormControl>
                          <Input placeholder="220V" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="powerRequirements.power"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Puissance</FormLabel>
                        <FormControl>
                          <Input placeholder="150W" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="powerRequirements.frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fréquence</FormLabel>
                        <FormControl>
                          <Input placeholder="50Hz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="w-full sm:w-auto gap-2">
                <FileText size={16} />
                {isEditing ? "Modifier la fiche" : "Créer la fiche"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
