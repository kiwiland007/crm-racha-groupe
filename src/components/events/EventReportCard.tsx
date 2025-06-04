import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Calendar, 
  MapPin, 
  Users, 
  Package, 
  Clock,
  User,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { EventReportData } from "@/services/eventReportPDFService";
import { documentAttachmentService } from "@/services/documentAttachmentService";
import { toast } from "sonner";

interface EventReportCardProps {
  event: any;
  onGenerateReport?: (event: any) => void;
  showAttachmentOptions?: boolean;
}

export function EventReportCard({ 
  event, 
  onGenerateReport,
  showAttachmentOptions = false 
}: EventReportCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmé":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "en attente":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "annulé":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmé":
        return "bg-green-100 text-green-800 border-green-200";
      case "en attente":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "annulé":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const handleGenerateReport = async () => {
    if (onGenerateReport) {
      setIsGenerating(true);
      try {
        await onGenerateReport(event);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleGenerateWithAttachments = async () => {
    setIsGenerating(true);
    try {
      // Convertir les données d'événement
      const reportData: EventReportData = {
        id: event.id || `EVT-${Date.now()}`,
        title: event.title || "Événement",
        client: event.client || "Client non spécifié",
        date: event.startDate || new Date().toLocaleDateString('fr-FR'),
        time: event.time || "Non spécifié",
        location: event.location || "Lieu non spécifié",
        status: event.status || "En attente",
        description: event.description || "",
        assignedTechnicians: event.assignedTechnicians || [],
        reservedMaterials: event.reservedMaterials || [],
        notes: event.notes || "",
        budget: event.budget || undefined,
        actualCost: event.actualCost || undefined
      };

      // Générer le package complet
      const result = documentAttachmentService.generateEventDocumentPackage(reportData);
      
      if (result.reportFilename) {
        toast.success("Package de documents généré", {
          description: "Rapport d'événement prêt pour attachement"
        });
      }
    } catch (error) {
      toast.error("Erreur génération package", {
        description: `Erreur: ${error.message || 'Erreur inconnue'}`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              {event.title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {event.description || "Aucune description disponible"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(event.status)}
            <Badge variant="outline" className={getStatusColor(event.status)}>
              {event.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Informations principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <User className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Client</p>
                <p className="text-sm text-gray-600">{event.client}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Calendar className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Date</p>
                <p className="text-sm text-gray-600">{event.startDate}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <MapPin className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Lieu</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Horaire</p>
                <p className="text-sm text-gray-600">{event.time}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-6 w-6 text-gray-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{event.teamMembers || 0}</p>
            <p className="text-xs text-gray-600">Techniciens</p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Package className="h-6 w-6 text-gray-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{event.equipments || 0}</p>
            <p className="text-xs text-gray-600">Équipements</p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Package className="h-6 w-6 text-gray-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">
              {event.reservedMaterials?.length || 0}
            </p>
            <p className="text-xs text-gray-600">Matériel réservé</p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <DollarSign className="h-6 w-6 text-gray-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">
              {event.budget ? `${event.budget.toLocaleString()} MAD` : "N/A"}
            </p>
            <p className="text-xs text-gray-600">Budget</p>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            {isGenerating ? "Génération..." : "Générer rapport PDF"}
          </Button>
          
          {showAttachmentOptions && (
            <Button 
              onClick={handleGenerateWithAttachments}
              disabled={isGenerating}
              variant="outline"
              className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Package complet
            </Button>
          )}
        </div>

        {/* Matériel réservé (si disponible) */}
        {event.reservedMaterials && event.reservedMaterials.length > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              Matériel réservé ({event.reservedMaterials.length})
            </h4>
            <div className="grid gap-2 max-h-32 overflow-y-auto">
              {event.reservedMaterials.slice(0, 5).map((material: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-blue-100">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {material.productName}
                  </span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    ×{material.quantity}
                  </Badge>
                </div>
              ))}
              {event.reservedMaterials.length > 5 && (
                <div className="text-center py-1">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                    +{event.reservedMaterials.length - 5} autres équipements
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
