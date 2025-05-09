import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductAvailabilityBadge from "./ProductAvailabilityBadge";
import ProductActions from "./ProductActions";

interface Product {
  id: string;
  name: string;
  description: string;
  price: {
    sale: string;
    rental: string;
  };
  category: string;
  availability: string;
  sku: string;
  technicalSpecs?: string;
}

interface ProductTableProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  isMobile: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({ 
  products, 
  onEditProduct,
  onDeleteProduct,
  isMobile
}) => {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "ecrans":
        return "Écrans tactiles";
      case "bornes":
        return "Bornes interactives";
      case "tables":
        return "Tables tactiles";
      case "accessoires":
        return "Accessoires";
      case "logiciels":
        return "Logiciels";
      default:
        return category;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Produit</TableHead>
            {!isMobile && <TableHead>Description</TableHead>}
            <TableHead className="text-right">Prix vente</TableHead>
            <TableHead className="text-right">Prix location</TableHead>
            {!isMobile && <TableHead>Catégorie</TableHead>}
            <TableHead>Disponibilité</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.sku}</TableCell>
              <TableCell>{product.name}</TableCell>
              {!isMobile && <TableCell className="max-w-[200px] truncate">{product.description}</TableCell>}
              <TableCell className="text-right">{parseInt(product.price.sale).toLocaleString()} MAD</TableCell>
              <TableCell className="text-right">{parseInt(product.price.rental).toLocaleString()} MAD/jour</TableCell>
              {!isMobile && <TableCell>{getCategoryLabel(product.category)}</TableCell>}
              <TableCell><ProductAvailabilityBadge availability={product.availability} /></TableCell>
              <TableCell>
                <ProductActions 
                  product={product} 
                  onEdit={onEditProduct} 
                  onDelete={onDeleteProduct} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;