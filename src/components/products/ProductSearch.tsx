
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  onSearch: (term: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onSearch }) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Rechercher des produits..."
        className="pl-8 bg-white border-gray-200 w-full"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default ProductSearch;
