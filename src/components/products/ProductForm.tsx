
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import ProductBasicInfo from "./form/ProductBasicInfo";
import ProductPriceInfo from "./form/ProductPriceInfo";
import ProductCategoryInfo from "./form/ProductCategoryInfo";
import ProductAvailabilityInfo from "./form/ProductAvailabilityInfo";
import ProductDescriptionInfo from "./form/ProductDescriptionInfo";
import ProductQRCode from "./form/ProductQRCode";

const productSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom du produit doit comporter au moins 2 caractères",
  }),
  description: z.string().min(10, {
    message: "La description doit comporter au moins 10 caractères",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Le prix doit être un nombre valide",
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
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct?: (product: ProductFormValues & { id: string }) => void;
  editProduct?: ProductFormValues & { id: string };
}

export function ProductForm({
  open,
  onOpenChange,
  onAddProduct,
  editProduct,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: editProduct || {
      name: "",
      description: "",
      price: "",
      category: "",
      availability: "en_stock",
      sku: "",
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    const productData = {
      ...data,
      id: editProduct?.id || `PRD-${Math.floor(Math.random() * 1000)}`,
    };

    if (onAddProduct) {
      onAddProduct(productData);
    } else {
      toast.success(editProduct ? "Produit mis à jour" : "Produit ajouté", {
        description: `Le produit ${data.name} a été ${editProduct ? "mis à jour" : "ajouté"} avec succès.`,
      });
    }
    
    if (!editProduct) {
      form.reset();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editProduct ? "Modifier le produit" : "Ajouter un produit"}
          </DialogTitle>
          <DialogDescription>
            {editProduct
              ? "Modifiez les détails du produit ci-dessous"
              : "Remplissez les détails du nouveau produit"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProductBasicInfo control={form.control} />
              <ProductPriceInfo control={form.control} />
              <ProductCategoryInfo control={form.control} />
              <ProductAvailabilityInfo control={form.control} />
            </div>

            <ProductDescriptionInfo control={form.control} />

            <div className="flex justify-end">
              {editProduct && (
                <ProductQRCode
                  productId={editProduct.id}
                  productName={editProduct.name}
                  productPrice={editProduct.price}
                />
              )}
            </div>

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
