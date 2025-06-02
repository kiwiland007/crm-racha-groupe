import React, { useState, useEffect } from "react";
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
import { useProductContext } from "@/contexts/ProductContext";

const technicalSheetSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  model: z.string().min(1, { message: "Le modèle est requis" }),
  brand: z.string().min(1, { message: "La marque est requise" }),
  category: z.string().min(1, { message: "La catégorie est requise" }),
  description: z.string().min(1, { message: "La description est requise" }),
  relatedProduct: z.string().optional(),
  relatedService: z.string().optional(),
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
  const { products, categories } = useProductContext();

  const getDefaultValues = () => {
    if (isEditing && editingSheet) {
      return {
        name: editingSheet.name || "",
        model: editingSheet.model || "",
        brand: editingSheet.brand || "",
        category: editingSheet.category || "",
        description: editingSheet.description || "",
        relatedProduct: editingSheet.relatedProduct || "",
        relatedService: editingSheet.relatedService || "",
        specifications: editingSheet.specifications || [{ name: "", value: "", unit: "" }],
        dimensions: {
          length: editingSheet.dimensions?.length || "",
          width: editingSheet.dimensions?.width || "",
          height: editingSheet.dimensions?.height || "",
          weight: editingSheet.dimensions?.weight || "",
        },
        powerRequirements: {
          voltage: editingSheet.powerRequirements?.voltage || "",
          power: editingSheet.powerRequirements?.power || "",
          frequency: editingSheet.powerRequirements?.frequency || "",
        },
        connectivity: editingSheet.connectivity || [],
        operatingConditions: {
          temperature: editingSheet.operatingConditions?.temperature || "",
          humidity: editingSheet.operatingConditions?.humidity || "",
        },
        warranty: editingSheet.warranty || "",
        certifications: editingSheet.certifications || [],
        accessories: editingSheet.accessories || [],
        maintenanceNotes: editingSheet.maintenanceNotes || "",
      };
    }

    return {
      name: "",
      model: "",
      brand: "",
      category: "",
      description: "",
      relatedProduct: "",
      relatedService: "",
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
    };
  };

  const form = useForm<TechnicalSheetFormValues>({
    resolver: zodResolver(technicalSheetSchema),
    defaultValues: getDefaultValues(),
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

  // Réinitialiser le formulaire quand editingSheet change
  useEffect(() => {
    if (open) {
      const values = getDefaultValues();
      form.reset(values);

      // Réinitialiser les images si en mode édition
      if (isEditing && editingSheet?.images) {
        setImages(editingSheet.images || []);
      } else {
        setImages([]);
      }
    }
  }, [open, editingSheet, isEditing]);

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
      <DialogContent className="w-[95vw] max-w-[1000px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            {isEditing ? "Modifier la fiche technique" : "Créer une fiche technique"}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {isEditing
              ? "Modifiez les informations techniques de l'équipement et ses associations"
              : "Créez une fiche technique complète avec spécifications, images et associations produits/services"
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
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                          <SelectContent
                            className="max-h-[200px] overflow-y-auto max-w-[300px]"
                            position="popper"
                            sideOffset={4}
                          >
                            {categories
                              .filter(cat => cat.type === 'product')
                              .map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  <span className="truncate">{category.name}</span>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Produits et Services associés */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Plus className="h-4 w-4 text-blue-600" />
                      Associations (optionnel)
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Associez cette fiche technique à des produits ou services existants
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="relatedProduct"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Produit associé (optionnel)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un produit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent
                            className="max-h-[200px] overflow-y-auto max-w-[350px]"
                            position="popper"
                            sideOffset={4}
                          >
                            <SelectItem value="none">Aucun produit</SelectItem>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                <span className="truncate">{product.name} - {product.sku}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="relatedService"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service associé (optionnel)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent
                            className="max-h-[200px] overflow-y-auto max-w-[300px]"
                            position="popper"
                            sideOffset={4}
                          >
                            <SelectItem value="none">Aucun service</SelectItem>
                            {categories
                              .filter(cat => cat.type === 'service')
                              .map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  <span className="truncate">{service.name}</span>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    </div>
                  </CardContent>
                </Card>

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
