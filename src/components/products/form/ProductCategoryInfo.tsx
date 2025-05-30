
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";
import { useProductContext } from "@/contexts/ProductContext";

interface ProductCategoryInfoProps {
  control: Control<any>;
}

const ProductCategoryInfo: React.FC<ProductCategoryInfoProps> = ({ control }) => {
  const { categories } = useProductContext();
  const productCategories = categories.filter(cat => cat.type === "product");

  return (
    <FormField
      control={control}
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
              {productCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
              {productCategories.length === 0 && (
                <SelectItem value="" disabled>
                  Aucune catégorie disponible
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProductCategoryInfo;
