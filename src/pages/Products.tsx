import { useState, useEffect } from "react";
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
import CategoryManager from "@/components/products/CategoryManager";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductContext, Product } from "@/contexts/ProductContext";
import { useAdvancedSearch } from "@/hooks/use-search";

export default function Products() {
  const isMobile = useIsMobile();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategoryById
  } = useProductContext();

  const [openProductForm, setOpenProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Utilisation du hook de recherche avancée
  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredProducts,
    filters: activeFilters,
    setFilter,
    clearAllFilters,
    activeFilterCount,
    resultCount
  } = useAdvancedSearch({
    data: products,
    searchFields: ['name', 'description', 'sku'],
    filterFunctions: {
      category: (product, categoryValue) => product.category === categoryValue,
      availability: (product, availabilityValue) => product.availability === availabilityValue,
      priceRange: (product, priceRangeValue) => {
        const price = parseInt(product.price.sale);
        switch (priceRangeValue) {
          case "0-20000":
            return price >= 0 && price <= 20000;
          case "20000-50000":
            return price > 20000 && price <= 50000;
          case "50000+":
            return price > 50000;
          default:
            return true;
        }
      }
    }
  });


  
  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    addProduct(productData);
    toast.success("Produit ajouté", {
      description: `Le produit ${productData.name} a été ajouté avec succès.`,
    });
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setOpenProductForm(true);
  };
  
  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    toast.success("Produit supprimé", {
      description: `Le produit a été supprimé avec succès.`,
    });
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilter = (filters: any) => {
    Object.entries(filters).forEach(([key, value]) => {
      setFilter(key, value);
    });
  };

  return (
    <Layout title="Produits">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <ProductsHeader
            onAddProduct={() => {
              setEditingProduct(undefined);
              setOpenProductForm(true);
            }}
            onSearch={handleSearch}
            onFilter={handleFilter}
          />

          <Card>
            <CardHeader>
              <CardTitle>Liste des produits</CardTitle>
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
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryManager />
        </TabsContent>
      </Tabs>

      <ProductForm
        open={openProductForm}
        onOpenChange={setOpenProductForm}
        onAddProduct={handleAddProduct}
        editProduct={editingProduct}
      />
    </Layout>
  );
}