
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

interface ProductCategoryInfoProps {
  control: Control<any>;
}

const ProductCategoryInfo: React.FC<ProductCategoryInfoProps> = ({ control }) => {
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
  );
};

export default ProductCategoryInfo;
