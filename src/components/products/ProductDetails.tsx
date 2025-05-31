import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/contexts/ProductContext";
import { useProductContext } from "@/contexts/ProductContext";
import { Package, DollarSign, FileText, Info, Zap, Shield } from "lucide-react";

interface ProductDetailsProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  open,
  onOpenChange,
}) => {
  const { getCategoryById } = useProductContext();

  if (!product) return null;

  const category = getCategoryById(product.category);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "en_stock":
        return "bg-green-100 text-green-800";
      case "sur_commande":
        return "bg-yellow-100 text-yellow-800";
      case "rupture":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case "en_stock":
        return "En stock";
      case "sur_commande":
        return "Sur commande";
      case "rupture":
        return "Rupture de stock";
      default:
        return availability;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-6 w-6 text-blue-600" />
            Détails du produit
          </DialogTitle>
          <DialogDescription>
            Informations complètes pour <span className="font-semibold text-gray-900">{product.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nom du produit</p>
                  <p className="text-lg font-semibold">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">SKU</p>
                  <p className="text-lg font-mono">{product.sku}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Catégorie</p>
                  <Badge className={category?.color || "bg-gray-100 text-gray-800"}>
                    {category?.name || product.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Disponibilité</p>
                  <Badge className={getAvailabilityColor(product.availability)}>
                    {getAvailabilityLabel(product.availability)}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                <p className="text-gray-800 leading-relaxed">{product.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tarification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Tarification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-700 mb-1">Prix de vente</p>
                  <p className="text-2xl font-bold text-green-800">
                    {parseInt(product.price.sale).toLocaleString()} MAD
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-700 mb-1">Prix de location</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {parseInt(product.price.rental).toLocaleString()} MAD/jour
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spécifications techniques */}
          {product.technicalSpecs && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Spécifications techniques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {product.technicalSpecs}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Spécifications détaillées */}
          {(product.dimensions || product.weight || product.powerConsumption || product.warranty || product.certifications) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  Spécifications détaillées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.dimensions && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Dimensions</p>
                      <p className="text-gray-800">{product.dimensions}</p>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Poids</p>
                      <p className="text-gray-800">{product.weight}</p>
                    </div>
                  )}
                  {product.powerConsumption && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Consommation</p>
                      <p className="text-gray-800">{product.powerConsumption}</p>
                    </div>
                  )}
                  {product.warranty && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Garantie</p>
                      <p className="text-gray-800 flex items-center gap-1">
                        <Shield className="h-4 w-4 text-green-600" />
                        {product.warranty}
                      </p>
                    </div>
                  )}
                  {product.certifications && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-600">Certifications</p>
                      <p className="text-gray-800">{product.certifications}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Images */}
          {product.images && product.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-indigo-600" />
                  Images du produit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((imageUrl, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBMMTMwIDEzMEg3MEwxMDAgNzBaIiBmaWxsPSIjOUI5QkEwIi8+CjxjaXJjbGUgY3g9IjEzMCIgY3k9IjgwIiByPSIxMCIgZmlsbD0iIzlCOUJBMCIvPgo8L3N2Zz4K";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
