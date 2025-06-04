import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import ProductBasicInfo from "./form/ProductBasicInfo";
import ProductPriceInfo from "./form/ProductPriceInfo";
import ProductCategoryInfo from "./form/ProductCategoryInfo";
import ProductAvailabilityInfo from "./form/ProductAvailabilityInfo";
import ProductDescriptionInfo from "./form/ProductDescriptionInfo";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom du produit doit comporter au moins 2 caractères",
  }),
  description: z.string().min(10, {
    message: "La description doit comporter au moins 10 caractères",
  }),
  price: z.object({
    sale: z.string().refine((val) => !isNaN(Number(val)), {
      message: "Le prix de vente doit être un nombre valide",
    }),
    rental: z.string().refine((val) => !isNaN(Number(val)), {
      message: "Le prix de location doit être un nombre valide",
    }),
  }),
  category: z.string().min(1, {
    message: "Veuillez sélectionner une catégorie",
  }),
  availability: z.string().min(1, {
    message: "Veuillez sélectionner une disponibilité",
  }),
  sku: z.string().min(1, {
    message: "Le SKU est requis",
  }),
  technicalSpecs: z.string().optional(),
  // Champs techniques détaillés
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  powerConsumption: z.string().optional(),
  warranty: z.string().optional(),
  certifications: z.string().optional(),
  images: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct?: (product: ProductFormValues) => void;
  editProduct?: ProductFormValues & { id: string };
}

export function ProductForm({
  open,
  onOpenChange,
  onAddProduct,
  editProduct,
}: ProductFormProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: {
        sale: "",
        rental: "",
      },
      category: "",
      availability: "en_stock",
      sku: "",
      technicalSpecs: "",
      dimensions: "",
      weight: "",
      powerConsumption: "",
      warranty: "2 ans",
      certifications: "",
      images: [],
    },
  });

  // Effet pour charger les données du produit à modifier
  React.useEffect(() => {
    if (editProduct && open) {
      // Réinitialiser le formulaire avec les données du produit
      form.reset({
        name: editProduct.name || "",
        description: editProduct.description || "",
        price: {
          sale: editProduct.price?.sale || "",
          rental: editProduct.price?.rental || "",
        },
        category: editProduct.category || "",
        availability: editProduct.availability || "en_stock",
        sku: editProduct.sku || "",
        technicalSpecs: editProduct.technicalSpecs || "",
        dimensions: editProduct.dimensions || "",
        weight: editProduct.weight || "",
        powerConsumption: editProduct.powerConsumption || "",
        warranty: editProduct.warranty || "2 ans",
        certifications: editProduct.certifications || "",
        images: editProduct.images || [],
      });

      // Charger les images
      setUploadedImages(editProduct.images || []);
    } else if (!editProduct && open) {
      // Réinitialiser pour un nouveau produit
      form.reset({
        name: "",
        description: "",
        price: {
          sale: "",
          rental: "",
        },
        category: "",
        availability: "en_stock",
        sku: "",
        technicalSpecs: "",
        dimensions: "",
        weight: "",
        powerConsumption: "",
        warranty: "2 ans",
        certifications: "",
        images: [],
      });
      setUploadedImages([]);
    }
  }, [editProduct, open, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedImages(prev => {
            const newImages = [...prev, result];
            form.setValue('images', newImages);
            return newImages;
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      form.setValue('images', newImages);
      return newImages;
    });
  };

  const onSubmit = (data: ProductFormValues) => {
    const submitData = {
      ...data,
      images: uploadedImages
    };

    // Toujours appeler onAddProduct qui gère à la fois l'ajout et la modification
    if (onAddProduct) {
      onAddProduct(submitData);
    }

    // Réinitialiser seulement pour un nouveau produit
    if (!editProduct) {
      form.reset();
      setUploadedImages([]);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[800px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {editProduct ? "Modifier le produit" : "Ajouter un produit"}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {editProduct
              ? "Modifiez les détails du produit ci-dessous"
              : "Remplissez les détails du nouveau produit"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="details" className="text-xs sm:text-sm">Détails</TabsTrigger>
                <TabsTrigger value="technical" className="text-xs sm:text-sm">Technique</TabsTrigger>
                <TabsTrigger value="specifications" className="text-xs sm:text-sm">Spécifications</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <ProductBasicInfo control={form.control} />
                    <ProductCategoryInfo control={form.control} />
                  </div>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="price.sale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix de vente (MAD)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price.rental"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix de location (MAD/jour)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ProductAvailabilityInfo control={form.control} />
                  </div>
                </div>

                <ProductDescriptionInfo control={form.control} />
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <FormField
                  control={form.control}
                  name="technicalSpecs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description technique générale</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Fonctionnalités principales, technologies utilisées..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="warranty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Garantie</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 2 ans" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="certifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certifications</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: CE, FCC, RoHS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions (L x l x H)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 180 x 60 x 40 cm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poids</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 45 kg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="powerConsumption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consommation électrique</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 150W" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Upload d'images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-indigo-600" />
                      Images du produit
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Zone d'upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          Cliquez pour ajouter des images
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, GIF jusqu'à 10MB chacune
                        </p>
                      </label>
                    </div>

                    {/* Aperçu des images */}
                    {uploadedImages.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Images ajoutées ({uploadedImages.length})
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={image}
                                  alt={`Aperçu ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>



            <DialogFooter>
              <Button type="submit">
                {editProduct ? "Mettre à jour" : "Ajouter le produit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductForm;