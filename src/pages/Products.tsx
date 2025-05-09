
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductTable from "@/components/products/ProductTable";
import ProductForm from "@/components/products/ProductForm";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  availability: string;
  sku: string;
};

export default function Products() {
  const isMobile = useIsMobile();
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: "PRD-001",
      name: "Écran tactile 32\"",
      description: "Écran tactile 32 pouces avec résolution 4K et 10 points de contact",
      price: "15000",
      category: "ecrans",
      availability: "en_stock",
      sku: "ECR-32-4K",
    },
    {
      id: "PRD-002",
      name: "Borne interactive 42\"",
      description: "Borne interactive avec écran 42 pouces pour centres commerciaux",
      price: "38000",
      category: "bornes",
      availability: "sur_commande",
      sku: "BRN-42-COM",
    },
    {
      id: "PRD-003",
      name: "Table tactile 55\"",
      description: "Table tactile 55 pouces pour restaurants et hôtels",
      price: "62000",
      category: "tables",
      availability: "en_stock",
      sku: "TBL-55-HTL",
    },
  ]);
  
  const [openProductForm, setOpenProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleAddProduct = (productData: Product) => {
    setProducts([productData, ...products]);
    toast.success("Produit ajouté", {
      description: `Le produit ${productData.name} a été ajouté avec succès.`,
    });
    return productData;
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setOpenProductForm(true);
  };
  
  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
    toast.success("Produit supprimé", {
      description: `Le produit a été supprimé avec succès.`,
    });
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Produits">
      <div className="flex flex-col gap-4">
        <ProductsHeader 
          onAddProduct={() => {
            setEditingProduct(undefined);
            setOpenProductForm(true);
          }}
          onSearch={handleSearch}
        />

        <Card>
          <CardHeader>
            <CardTitle>Produits</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? "p-0" : "p-0"}>
            <ProductTable 
              products={filteredProducts} 
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              isMobile={isMobile}
            />
          </CardContent>
        </Card>
      </div>
      
      <ProductForm 
        open={openProductForm} 
        onOpenChange={setOpenProductForm}
        onAddProduct={handleAddProduct}
        editProduct={editingProduct}
      />
    </Layout>
  );
}
