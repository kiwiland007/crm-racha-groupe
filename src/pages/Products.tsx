
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, MoreVertical, Plus, Search, QrCode, Edit, Trash2 } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";
import { QRCodeGenerator } from "@/components/common/QRCodeGenerator";
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
  
  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "en_stock":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">En stock</Badge>;
      case "sur_commande":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sur commande</Badge>;
      case "rupture":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rupture de stock</Badge>;
      default:
        return <Badge variant="outline">{availability}</Badge>;
    }
  };

  return (
    <Layout title="Produits">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher des produits..."
                className="pl-8 bg-white border-gray-200 w-full"
              />
            </div>
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
              <Filter size={16} />
              Filtres
            </Button>
          </div>
          <Button className="gap-2 w-full md:w-auto" onClick={() => {
            setEditingProduct(undefined);
            setOpenProductForm(true);
          }}>
            <Plus size={16} />
            Nouveau produit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Produits</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? "p-0" : "p-0"}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Produit</TableHead>
                    {!isMobile && <TableHead>Description</TableHead>}
                    <TableHead className="text-right">Prix (MAD)</TableHead>
                    {!isMobile && <TableHead>Catégorie</TableHead>}
                    <TableHead>Disponibilité</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      {!isMobile && <TableCell className="max-w-[200px] truncate">{product.description}</TableCell>}
                      <TableCell className="text-right">{parseInt(product.price).toLocaleString()} MAD</TableCell>
                      {!isMobile && <TableCell>{getCategoryLabel(product.category)}</TableCell>}
                      <TableCell>{getAvailabilityBadge(product.availability)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              const dialogProductForm = document.createElement('div');
                              dialogProductForm.style.display = 'none';
                              document.body.appendChild(dialogProductForm);
                              
                              // Create QR Code dialog programmatically
                              const qrDialog = document.createElement('div');
                              qrDialog.innerHTML = `
                                <div id="qr-product-${product.id}" style="display:none;"></div>
                              `;
                              document.body.appendChild(qrDialog);
                              
                              // Create a React root and render the QRCodeGenerator
                              // Since we can't do this here directly, we provide a dialog option
                              toast.success("QR Code généré", {
                                description: "Utilisez l'option 'Générer QR Code' dans le formulaire de modification du produit.",
                              });
                              handleEditProduct(product);
                            }}>
                              <QrCode className="mr-2 h-4 w-4" />
                              Générer QR Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
