
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

interface ProductAvailabilityInfoProps {
  control: Control<any>;
}

const ProductAvailabilityInfo: React.FC<ProductAvailabilityInfoProps> = ({ control }) => {
  return (
    <FormField
      control={control}
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
  );
};

export default ProductAvailabilityInfo;
