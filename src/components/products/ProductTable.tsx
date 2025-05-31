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
import { useProductContext, Product } from "@/contexts/ProductContext";

interface ProductTableProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onDuplicateProduct?: (product: Omit<Product, 'id'>) => void;
  isMobile: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEditProduct,
  onDeleteProduct,
  onDuplicateProduct,
  isMobile
}) => {
  const { getCategoryById } = useProductContext();

  const getCategoryLabel = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    return category ? category.name : categoryId;
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
                  onDuplicate={onDuplicateProduct}
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