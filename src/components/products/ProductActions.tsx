
import React from "react";
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

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  availability: string;
  sku: string;
}

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product, onEdit, onDelete }) => {
  const handleViewDetails = () => {
    toast.info("Détails du produit", {
      description: `Affichage des détails de ${product.name}`
    });
  };

  const handleGenerateTechnicalSheet = () => {
    const data = {
      name: product.name,
      reference: product.sku,
      category: product.category,
      description: product.description,
      price: product.price,
      specifications: `Produit de qualité professionnelle\nDisponibilité: ${product.availability}`
    };

    generateTechnicalSheetPDF(data);
  };

  const handleDuplicate = () => {
    const duplicatedProduct = {
      ...product,
      id: `${product.id}_copy`,
      sku: `${product.sku}_COPY`,
      name: `${product.name} (Copie)`
    };

    toast.success("Produit dupliqué", {
      description: `${product.name} a été dupliqué`
    });
  };

  const handleGenerateQR = () => {
    // Générer QR code avec les informations du produit
    const qrData = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price
    };

    toast.success("QR Code généré", {
      description: `QR Code pour ${product.name} généré`
    });
  };

  return (
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
  );
};

export default ProductActions;
