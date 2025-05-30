
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

interface ProductPriceInfoProps {
  control: Control<Record<string, unknown>>;
}

const ProductPriceInfo: React.FC<ProductPriceInfoProps> = ({ control }) => {
  return (
    <FormField
      control={control}
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
  );
};

export default ProductPriceInfo;
