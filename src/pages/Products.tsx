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
  price: {
    sale: string;
    rental: string;
  };
  category: string;
  availability: string;
  sku: string;
  technicalSpecs?: string;
};

export default function Products() {
  const isMobile = useIsMobile();
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: "PRD-001",
      name: "Écran tactile 32\"",
      description: "Écran tactile 32 pouces avec résolution 4K et 10 points de contact",
      price: {
        sale: "15000",
        rental: "2000"
      },
      category: "ecrans",
      availability: "en_stock",
      sku: "ECR-32-4K",
      technicalSpecs: "Résolution: 3840x2160\nTechnologie tactile: Capacitive\nPoints de contact: 10\nConnectivité: HDMI, USB-C\nDimensions: 80x50x5cm"
    },
    {
      id: "PRD-002",
      name: "Borne interactive 42\"",
      description: "Borne interactive avec écran 42 pouces pour centres commerciaux",
      price: {
        sale: "38000",
        rental: "5000"
      },
      category: "bornes",
      availability: "sur_commande",
      sku: "BRN-42-COM",
      technicalSpecs: "Écran: 42\" Full HD\nProcesseur: Intel i5\nMémoire: 8GB RAM\nStockage: 256GB SSD\nOS: Windows 10 Pro"
    },
    {
      id: "PRD-003",
      name: "Table tactile 55\"",
      description: "Table tactile 55 pouces pour restaurants et hôtels",
      price: {
        sale: "62000",
        rental: "8000"
      },
      category: "tables",
      availability: "en_stock",
      sku: "TBL-55-HTL",
      technicalSpecs: "Taille: 55 pouces\nRésolution: 4K UHD\nVerre trempé: 6mm\nProtection IP65\nHauteur ajustable: 70-110cm"
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