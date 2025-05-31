import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Product } from "@/contexts/ProductContext";
import { Copy, Package } from "lucide-react";

const duplicateSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom du produit doit comporter au moins 2 caractères",
  }),
  sku: z.string().min(1, {
    message: "Le SKU est requis",
  }),
});

type DuplicateFormValues = z.infer<typeof duplicateSchema>;

interface ProductDuplicateProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDuplicate: (product: Omit<Product, 'id'>) => void;
}

const ProductDuplicate: React.FC<ProductDuplicateProps> = ({
  product,
  open,
  onOpenChange,
  onDuplicate,
}) => {
  const form = useForm<DuplicateFormValues>({
    resolver: zodResolver(duplicateSchema),
    defaultValues: {
      name: product ? `${product.name} (Copie)` : "",
      sku: product ? `${product.sku}_COPY` : "",
    },
  });

  React.useEffect(() => {
    if (product && open) {
      form.reset({
        name: `${product.name} (Copie)`,
        sku: `${product.sku}_COPY`,
      });
    }
  }, [product, open, form]);

  const onSubmit = (data: DuplicateFormValues) => {
    if (!product) return;

    const duplicatedProduct: Omit<Product, 'id'> = {
      ...product,
      name: data.name,
      sku: data.sku,
    };

    onDuplicate(duplicatedProduct);
    onOpenChange(false);
    form.reset();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-blue-600" />
            Dupliquer le produit
          </DialogTitle>
          <DialogDescription>
            Créer une copie de <span className="font-semibold">{product.name}</span> avec un nouveau nom et SKU.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Produit original */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Produit original</span>
              </div>
              <p className="font-semibold text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-600">SKU: {product.sku}</p>
            </div>

            {/* Nouveau nom */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau nom du produit</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du produit dupliqué" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nouveau SKU */}
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="SKU unique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Informations conservées */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-2">Informations conservées :</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Description et spécifications techniques</li>
                <li>• Prix de vente et de location</li>
                <li>• Catégorie et disponibilité</li>
                <li>• Dimensions, poids et certifications</li>
                <li>• Images du produit</li>
              </ul>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Copy className="mr-2 h-4 w-4" />
                Dupliquer le produit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDuplicate;
