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
import { Calendar, MapPin, Package, DollarSign, AlertCircle, Wrench } from "lucide-react";

interface Equipment {
  id: number;
  name: string;
  category: string;
  status: string;
  quantity: number;
  location: string;
  lastMaintenance: string;
  alert: boolean;
  price: {
    sale: number;
    rental: number;
  };
  serialNumber?: string;
  purchaseDate?: string;
  notes?: string;
}

interface EquipmentDetailsProps {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EquipmentDetails({ equipment, open, onOpenChange }: EquipmentDetailsProps) {
  if (!equipment) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponible":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Disponible
          </Badge>
        );
      case "loué":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Loué
          </Badge>
        );
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Maintenance
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {equipment.name}
            {equipment.alert && <AlertCircle className="h-5 w-5 text-amber-500" />}
          </DialogTitle>
          <DialogDescription>
            Détails complets de l'équipement #{equipment.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    Catégorie
                  </div>
                  <p className="font-medium">{equipment.category}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    Statut
                  </div>
                  <div>{getStatusBadge(equipment.status)}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    Quantité
                  </div>
                  <p className="font-medium">{equipment.quantity} unité(s)</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    Emplacement
                  </div>
                  <p className="font-medium">{equipment.location}</p>
                </div>
              </div>

              {equipment.serialNumber && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Numéro de série</div>
                  <p className="font-medium font-mono">{equipment.serialNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations financières */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Tarification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Prix de vente</div>
                  <p className="text-lg font-bold text-green-600">
                    {equipment.price.sale.toLocaleString()} MAD
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Prix de location</div>
                  <p className="text-lg font-bold text-blue-600">
                    {equipment.price.rental.toLocaleString()} MAD/jour
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Dernière maintenance
                </div>
                <p className="font-medium">{equipment.lastMaintenance}</p>
                
                {equipment.alert && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Maintenance requise</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">
                      Cet équipement nécessite une maintenance préventive.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dates importantes */}
          {equipment.purchaseDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Date d'achat</div>
                  <p className="font-medium">{equipment.purchaseDate}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {equipment.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{equipment.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
