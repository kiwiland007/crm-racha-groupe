import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Monitor,
  Zap,
  Thermometer,
  Shield,
  Package,
  Wrench,
  Download,
  Edit
} from "lucide-react";

interface TechnicalSheetDetailsProps {
  sheet: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (sheet: any) => void;
  onGeneratePDF?: (sheet: any) => void;
}

export function TechnicalSheetDetails({
  sheet,
  open,
  onOpenChange,
  onEdit,
  onGeneratePDF
}: TechnicalSheetDetailsProps) {
  if (!sheet) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6 text-blue-600" />
            {sheet.name}
          </DialogTitle>
          <DialogDescription>
            {sheet.brand} - {sheet.model} | Fiche technique complète
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-blue-600" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nom</p>
                  <p className="text-lg font-semibold">{sheet.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Modèle</p>
                  <p className="text-lg font-semibold">{sheet.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Marque</p>
                  <p className="text-lg font-semibold">{sheet.brand}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Catégorie</p>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {sheet.category}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                <p className="text-gray-800">{sheet.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Spécifications techniques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Spécifications techniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sheet.specifications?.map((spec: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{spec.name}</span>
                    <span className="text-gray-900">
                      {spec.value} {spec.unit}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dimensions et poids */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                Dimensions et poids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Longueur</p>
                  <p className="text-lg font-semibold text-purple-800">{sheet.dimensions?.length} mm</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Largeur</p>
                  <p className="text-lg font-semibold text-purple-800">{sheet.dimensions?.width} mm</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Hauteur</p>
                  <p className="text-lg font-semibold text-purple-800">{sheet.dimensions?.height} mm</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Poids</p>
                  <p className="text-lg font-semibold text-purple-800">{sheet.dimensions?.weight} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alimentation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Alimentation électrique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Tension</p>
                  <p className="text-lg font-semibold text-yellow-800">{sheet.powerRequirements?.voltage}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Puissance</p>
                  <p className="text-lg font-semibold text-yellow-800">{sheet.powerRequirements?.power}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Fréquence</p>
                  <p className="text-lg font-semibold text-yellow-800">{sheet.powerRequirements?.frequency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connectivité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-indigo-600" />
                Connectivité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {sheet.connectivity?.map((conn: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-indigo-100 text-indigo-800">
                    {conn}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conditions de fonctionnement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-600" />
                Conditions de fonctionnement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Température</p>
                  <p className="text-lg font-semibold text-red-800">{sheet.operatingConditions?.temperature}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Humidité</p>
                  <p className="text-lg font-semibold text-red-800">{sheet.operatingConditions?.humidity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Garantie et certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Garantie et certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Garantie</p>
                <p className="text-lg font-semibold text-green-800">{sheet.warranty}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {sheet.certifications?.map((cert: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-green-100 text-green-800">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessoires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-600" />
                Accessoires inclus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sheet.accessories?.map((accessory: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-orange-800">{accessory}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes de maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-gray-600" />
                Notes de maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                {sheet.maintenanceNotes}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button onClick={() => onEdit?.(sheet)} className="flex-1 gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
            <Button onClick={() => onGeneratePDF?.(sheet)} variant="outline" className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
