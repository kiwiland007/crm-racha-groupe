
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
import { technicalSheetPDFService } from "@/services/technicalSheetPDFService";

import { qrCodeService } from "@/services/qrCodeService";
import { Product } from "@/contexts/ProductContext";
import ProductDetails from "./ProductDetails";
import ProductDuplicate from "./ProductDuplicate";
import QRCodeGenerator from "@/components/common/QRCodeGenerator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onDuplicate?: (product: Omit<Product, 'id'>) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product, onEdit, onDelete, onDuplicate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  const handleGenerateTechnicalSheet = () => {
    try {
      console.log("=== DÉBUT GÉNÉRATION FICHE TECHNIQUE ===");
      console.log("Produit original:", product);

      // Validation des données minimales requises
      if (!product || !product.id || !product.name) {
        toast.error("Données produit incomplètes", {
          description: "Impossible de générer la fiche technique"
        });
        return;
      }

      // Formatage sécurisé des données
      const technicalData = {
        id: String(product.id),
        name: String(product.name || 'Produit sans nom'),
        brand: product.brand || '',
        model: product.model || '',
        category: String(product.category || 'Non catégorisé'),
        description: String(product.description || 'Aucune description disponible'),
        price: {
          sale: typeof product.price === 'string'
            ? product.price
            : (product.price?.sale || '0'),
          rental: typeof product.price === 'string'
            ? '0'
            : (product.price?.rental || '0')
        },
        technicalSpecs: product.technicalSpecs || '',
        specifications: product.specifications || {},
        features: Array.isArray(product.features) ? product.features : [],
        maintenanceNotes: product.maintenanceNotes || '',
        warranty: product.warranty || '',
        availability: product.availability || 'en_stock',
        sku: product.sku || product.reference || `REF-${product.id}`
      };

      console.log("Données formatées pour PDF:", technicalData);

      const result = technicalSheetPDFService.generateTechnicalSheetPDF(technicalData);

      if (result) {
        console.log("✅ Fiche technique générée avec succès:", result);
      } else {
        console.warn("⚠️ Génération fiche technique retournée null");
        toast.error("Erreur génération fiche technique", {
          description: "Le service n'a pas pu générer le fichier"
        });
      }
    } catch (error) {
      console.error("❌ ERREUR GÉNÉRATION FICHE TECHNIQUE:", error);
      toast.error("Erreur génération fiche technique", {
        description: `Erreur: ${error instanceof Error ? error.message : 'Problème technique'}`
      });
    }
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
    setShowQRModal(true);
    toast.success("QR Code généré", {
      description: `QR Code pour ${product.name} affiché`
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

      {/* Modal QR Code identique à l'inventaire */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">QR Code - {product.name}</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {(() => {
                const qrResult = qrCodeService.generateProductQR(product);
                return (
                  <QRCodeGenerator
                    value={qrResult.jsonContent}
                    size={200}
                    level="M"
                    includeMargin={true}
                    productId={product.id}
                    type="product"
                  />
                );
              })()}

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Scannez ce code pour accéder aux informations du produit
                </p>
                <p className="text-xs text-gray-500">
                  Compatible avec tous les lecteurs QR
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductActions;
