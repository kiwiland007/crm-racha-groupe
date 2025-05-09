
import React from "react";
import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductSearch from "./ProductSearch";

interface ProductsHeaderProps {
  onAddProduct: () => void;
  onSearch: (term: string) => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ onAddProduct, onSearch }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
        <ProductSearch onSearch={onSearch} />
        <Button variant="outline" size="sm" className="hidden md:flex gap-2">
          <Filter size={16} />
          Filtres
        </Button>
      </div>
      <Button className="gap-2 w-full md:w-auto" onClick={onAddProduct}>
        <Plus size={16} />
        Nouveau produit
      </Button>
    </div>
  );
};

export default ProductsHeader;
