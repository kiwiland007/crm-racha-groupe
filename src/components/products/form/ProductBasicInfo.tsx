
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface ProductBasicInfoProps {
  control: Control<Record<string, unknown>>;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
    </>
  );
};

export default ProductBasicInfo;
