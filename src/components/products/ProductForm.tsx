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
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QRCodeGenerator from "../common/QRCodeGenerator";

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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du produit</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du produit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU (Référence)</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU du produit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (MAD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
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
                    <FormLabel>Catégorie</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ecrans">Écrans tactiles</SelectItem>
                        <SelectItem value="bornes">Bornes interactives</SelectItem>
                        <SelectItem value="tables">Tables tactiles</SelectItem>
                        <SelectItem value="accessoires">Accessoires</SelectItem>
                        <SelectItem value="logiciels">Logiciels</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disponibilité</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une disponibilité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en_stock">En stock</SelectItem>
                        <SelectItem value="sur_commande">Sur commande</SelectItem>
                        <SelectItem value="rupture">Rupture de stock</SelectItem>
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
                      placeholder="Description du produit..."
                      {...field}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              {editProduct && (
                <QRCodeGenerator 
                  type="product" 
                  productId={editProduct.id} 
                  value={JSON.stringify({
                    id: editProduct.id,
                    name: editProduct.name,
                    price: editProduct.price
                  })}
                  showDialog={true}
                  size={128}
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
