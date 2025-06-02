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
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  User, 
  Calendar, 
  Package, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Edit
} from "lucide-react";

interface BonLivraisonItem {
  designation: string;
  quantiteCommandee: number;
  quantiteLivree: number;
  unite: string;
}

interface BonLivraison {
  id: string;
  devisId: string;
  client: string;
  clientAdresse: string;
  dateCreation: string;
  dateLivraison: string;
  livreur: string;
  transporteur: string;
  status: string;
  items: BonLivraisonItem[];
  totalColis: number;
  signatureClient: boolean;
  signatureLivreur: boolean;
}

interface BonLivraisonDetailsProps {
  bonLivraison: BonLivraison | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGeneratePDF?: (bl: BonLivraison) => void;
  onEdit?: (bl: BonLivraison) => void;
}

const BonLivraisonDetails: React.FC<BonLivraisonDetailsProps> = ({
  bonLivraison,
  open,
  onOpenChange,
  onGeneratePDF,
  onEdit,
}) => {
  if (!bonLivraison) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "en_preparation":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "expedie":
        return <Package className="h-4 w-4 text-orange-600" />;
      case "en_cours_livraison":
        return <Truck className="h-4 w-4 text-amber-600" />;
      case "livre":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "partiellement_livre":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "refuse":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_preparation":
        return "bg-blue-100 text-blue-800";
      case "expedie":
        return "bg-orange-100 text-orange-800";
      case "en_cours_livraison":
        return "bg-amber-100 text-amber-800";
      case "livre":
        return "bg-green-100 text-green-800";
      case "partiellement_livre":
        return "bg-yellow-100 text-yellow-800";
      case "refuse":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_preparation":
        return "En préparation";
      case "expedie":
        return "Expédié";
      case "en_cours_livraison":
        return "En cours de livraison";
      case "livre":
        return "Livré";
      case "partiellement_livre":
        return "Partiellement livré";
      case "refuse":
        return "Refusé";
      default:
        return status;
    }
  };

  const totalQuantiteCommandee = bonLivraison.items.reduce((sum, item) => sum + item.quantiteCommandee, 0);
  const totalQuantiteLivree = bonLivraison.items.reduce((sum, item) => sum + item.quantiteLivree, 0);
  const tauxLivraison = totalQuantiteCommandee > 0 ? Math.round((totalQuantiteLivree / totalQuantiteCommandee) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Truck className="h-6 w-6 text-blue-600" />
            Bon de Livraison {bonLivraison.id}
          </DialogTitle>
          <DialogDescription>
            Détails complets du bon de livraison pour <span className="font-semibold text-gray-900">{bonLivraison.client}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">N° Bon de Livraison</p>
                  <p className="text-lg font-semibold">{bonLivraison.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">N° Devis associé</p>
                  <p className="text-lg font-semibold text-blue-600">{bonLivraison.devisId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date de création</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-lg">{bonLivraison.dateCreation}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date de livraison</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-lg">{bonLivraison.dateLivraison}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600">Statut</p>
                  <Badge className={`${getStatusColor(bonLivraison.status)} flex items-center gap-1 w-fit`}>
                    {getStatusIcon(bonLivraison.status)}
                    {getStatusLabel(bonLivraison.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Informations client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nom du client</p>
                  <p className="text-lg font-semibold">{bonLivraison.client}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Adresse de livraison</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <p className="text-gray-800">{bonLivraison.clientAdresse}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations livraison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" />
                Informations livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Livreur</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <p className="text-lg font-semibold">{bonLivraison.livreur}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Transporteur</p>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <p className="text-lg font-semibold">{bonLivraison.transporteur}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total colis</p>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <p className="text-lg font-semibold">{bonLivraison.totalColis}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de livraison</p>
                  <div className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full ${tauxLivraison === 100 ? 'bg-green-500' : tauxLivraison > 0 ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                    <p className="text-lg font-semibold">{tauxLivraison}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-indigo-600" />
                Articles à livrer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bonLivraison.items.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.designation}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Commandé: {item.quantiteCommandee} {item.unite}</span>
                          <span>Livré: {item.quantiteLivree} {item.unite}</span>
                          <span>Restant: {item.quantiteCommandee - item.quantiteLivree} {item.unite}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          item.quantiteLivree === item.quantiteCommandee 
                            ? 'bg-green-100 text-green-800' 
                            : item.quantiteLivree > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.quantiteLivree === item.quantiteCommandee 
                            ? 'Complet' 
                            : item.quantiteLivree > 0 
                            ? 'Partiel' 
                            : 'En attente'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Signatures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Signatures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`h-4 w-4 rounded-full ${bonLivraison.signatureClient ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Signature client</p>
                    <p className="font-semibold">{bonLivraison.signatureClient ? 'Signée' : 'En attente'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`h-4 w-4 rounded-full ${bonLivraison.signatureLivreur ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Signature livreur</p>
                    <p className="font-semibold">{bonLivraison.signatureLivreur ? 'Signée' : 'En attente'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => onGeneratePDF?.(bonLivraison)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Générer PDF
                </Button>
                
                <Button 
                  onClick={() => onEdit?.(bonLivraison)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BonLivraisonDetails;
