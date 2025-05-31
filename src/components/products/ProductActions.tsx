
import React, { useState } from "react";
import { MoreVertical, Edit, QrCode, Trash2, Eye, FileText, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { generateTechnicalSheetPDF } from "@/utils/pdfGenerator";
import { Product } from "@/contexts/ProductContext";
import ProductDetails from "./ProductDetails";
import ProductDuplicate from "./ProductDuplicate";

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onDuplicate?: (product: Omit<Product, 'id'>) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product, onEdit, onDelete, onDuplicate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  const handleGenerateTechnicalSheet = () => {
    const data = {
      name: product.name,
      reference: product.sku,
      category: product.category,
      description: product.description,
      price: typeof product.price === 'string' ? product.price : product.price.sale,
      specifications: product.technicalSpecs || `Produit de qualité professionnelle\nDisponibilité: ${product.availability}`
    };

    generateTechnicalSheetPDF(data);
  };

  const handleDuplicate = () => {
    setShowDuplicate(true);
  };

  const handleDuplicateConfirm = (duplicatedProduct: Omit<Product, 'id'>) => {
    if (onDuplicate) {
      onDuplicate(duplicatedProduct);
    }
    toast.success("Produit dupliqué", {
      description: `${duplicatedProduct.name} a été créé avec succès`
    });
  };

  const handleGenerateQR = () => {
    // Créer les données du QR Code
    const qrData = {
      name: product.name,
      sku: product.sku,
      price: typeof product.price === 'string' ? product.price : product.price.sale,
      category: product.category,
      url: `${window.location.origin}/products/${product.id}`
    };

    // Créer le contenu du QR Code
    const qrContent = `Produit: ${qrData.name}\nSKU: ${qrData.sku}\nPrix: ${qrData.price} MAD\nCatégorie: ${qrData.category}\nURL: ${qrData.url}`;

    // Créer un lien de téléchargement pour le QR Code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrContent)}`;

    // Ouvrir le QR Code dans un nouvel onglet
    window.open(qrUrl, '_blank');

    toast.success("QR Code généré", {
      description: `QR Code pour ${product.name} ouvert dans un nouvel onglet`,
      action: {
        label: "Télécharger",
        onClick: () => {
          const link = document.createElement('a');
          link.href = qrUrl;
          link.download = `qr-${product.sku}.png`;
          link.click();
        }
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            Voir détails
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(product)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Dupliquer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleGenerateQR}>
            <QrCode className="mr-2 h-4 w-4" />
            Générer QR Code
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGenerateTechnicalSheet}>
            <FileText className="mr-2 h-4 w-4" />
            Fiche technique
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modals */}
      <ProductDetails
        product={product}
        open={showDetails}
        onOpenChange={setShowDetails}
      />

      <ProductDuplicate
        product={product}
        open={showDuplicate}
        onOpenChange={setShowDuplicate}
        onDuplicate={handleDuplicateConfirm}
      />
    </>
  );
};

export default ProductActions;
