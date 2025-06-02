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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Package,
  User,
  Phone,
  Mail,
  Edit,
  UserPlus,
  PackageCheck,
  FileText
} from "lucide-react";
import { TECHNICIANS } from "@/contexts/EventContext";

interface EventDetailsProps {
  event: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (event: any) => void;
  onAssignTechnicians?: (event: any) => void;
  onReserveMaterial?: (event: any) => void;
}

export function EventDetails({
  event,
  open,
  onOpenChange,
  onEdit,
  onAssignTechnicians,
  onReserveMaterial
}: EventDetailsProps) {
  if (!event) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "planifié": { color: "bg-blue-100 text-blue-800", label: "Planifié" },
      "confirmé": { color: "bg-green-100 text-green-800", label: "Confirmé" },
      "en attente": { color: "bg-yellow-100 text-yellow-800", label: "En attente" },
      "annulé": { color: "bg-red-100 text-red-800", label: "Annulé" },
      "terminé": { color: "bg-gray-100 text-gray-800", label: "Terminé" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["planifié"];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getAssignedTechnicians = () => {
    if (!event.assignedTechnicians || event.assignedTechnicians.length === 0) {
      return [];
    }
    
    return TECHNICIANS.filter(tech => 
      event.assignedTechnicians.includes(tech.id)
    );
  };

  const assignedTechs = getAssignedTechnicians();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{event.title}</span>
            {getStatusBadge(event.status)}
          </DialogTitle>
          <DialogDescription>
            Détails complets de l'événement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Date:</span>
                    <span>
                      {event.startDate === event.endDate
                        ? event.startDate
                        : `${event.startDate} - ${event.endDate}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Heure:</span>
                    <span>{event.time || `${event.startTime} - ${event.endTime}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Lieu:</span>
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Client:</span>
                    <span>{event.client}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Équipe:</span>
                    <span>{event.teamMembers} technicien(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Équipements:</span>
                    <span>{event.equipments || 0} équipement(s)</span>
                  </div>
                </div>
              </div>
              
              {event.description && (
                <div className="mt-4">
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-gray-600">{event.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Techniciens assignés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Techniciens assignés ({assignedTechs.length})
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAssignTechnicians?.(event)}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Gérer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedTechs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignedTechs.map((tech) => (
                    <div
                      key={tech.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {tech.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{tech.name}</div>
                        <div className="text-sm text-gray-500">{tech.specialty}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{tech.phone}</span>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={tech.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {tech.available ? "Disponible" : "Occupé"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucun technicien assigné</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAssignTechnicians?.(event)}
                    className="mt-2 gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Assigner des techniciens
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Matériel réservé */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Matériel réservé ({event.reservedMaterials?.length || 0})
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReserveMaterial?.(event)}
                  className="gap-2"
                >
                  <PackageCheck className="h-4 w-4" />
                  Gérer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {event.reservedMaterials && event.reservedMaterials.length > 0 ? (
                <div className="space-y-3">
                  {event.reservedMaterials.map((material: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{material.name}</div>
                          <div className="text-sm text-gray-600">
                            Quantité: <span className="font-medium">{material.quantity}</span>
                            {material.category && (
                              <span className="ml-2">• {material.category}</span>
                            )}
                          </div>
                          {material.location && (
                            <div className="text-xs text-gray-500 mt-1">
                              📍 {material.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant="outline"
                          className={
                            material.status === "Réservé" ? "bg-green-100 text-green-800 border-green-300" :
                            material.status === "En cours" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                            material.status === "Livré" ? "bg-blue-100 text-blue-800 border-blue-300" :
                            "bg-gray-100 text-gray-800 border-gray-300"
                          }
                        >
                          {material.status || "Réservé"}
                        </Badge>
                        {material.price && (
                          <div className="text-sm font-medium text-gray-700">
                            {material.price} MAD
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Résumé du matériel */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">Total articles:</span>
                      <span>{event.reservedMaterials.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)}</span>
                    </div>
                    {event.reservedMaterials.some((item: any) => item.price) && (
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="font-medium">Valeur totale:</span>
                        <span className="font-bold">
                          {event.reservedMaterials.reduce((sum: number, item: any) =>
                            sum + ((parseFloat(item.price) || 0) * (item.quantity || 1)), 0
                          ).toFixed(2)} MAD
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Aucun matériel réservé</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Réservez du matériel pour cet événement
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReserveMaterial?.(event)}
                    className="gap-2"
                  >
                    <PackageCheck className="h-4 w-4" />
                    Réserver du matériel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button
              onClick={() => onEdit?.(event)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier l'événement
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onAssignTechnicians?.(event)}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Assigner techniciens
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onReserveMaterial?.(event)}
              className="gap-2"
            >
              <PackageCheck className="h-4 w-4" />
              Réserver matériel
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                // Générer un rapport d'événement
                console.log("Génération rapport événement:", event);
              }}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Générer rapport
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EventDetails;
