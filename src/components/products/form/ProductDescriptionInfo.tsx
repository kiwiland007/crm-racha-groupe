
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface ProductDescriptionInfoProps {
  control: Control<any>;
}

const ProductDescriptionInfo: React.FC<ProductDescriptionInfoProps> = ({ control }) => {
  return (
    <FormField
      control={control}
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
  );
};

export default ProductDescriptionInfo;
