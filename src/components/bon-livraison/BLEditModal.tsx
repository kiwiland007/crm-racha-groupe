import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, User, MapPin, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import { useBLContext } from "@/contexts/BLContext";

interface BLEditModalProps {
  bl: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BLEditModal({ bl, open, onOpenChange }: BLEditModalProps) {
  const { updateBL } = useBLContext();
  
  const [formData, setFormData] = useState({
    client: "",
    clientAdresse: "",
    clientPhone: "",
    clientEmail: "",
    dateLivraison: "",
    livreur: "",
    transporteur: "",
    vehicule: "",
    modeLivraison: "livraison_directe",
    status: "en_preparation",
    conditionsLivraison: "",
    observationsGenerales: "",
    observationsClient: "",
    totalColis: 1,
    poidsTotal: 0,
    volumeTotal: 0
  });

  useEffect(() => {
    if (bl && open) {
      setFormData({
        client: bl.client || "",
        clientAdresse: bl.clientAdresse || "",
        clientPhone: bl.clientPhone || "",
        clientEmail: bl.clientEmail || "",
        dateLivraison: bl.dateLivraison || "",
        livreur: bl.livreur || "",
        transporteur: bl.transporteur || "",
        vehicule: bl.vehicule || "",
        modeLivraison: bl.modeLivraison || "livraison_directe",
        status: bl.status || "en_preparation",
        conditionsLivraison: bl.conditionsLivraison || "",
        observationsGenerales: bl.observationsGenerales || "",
        observationsClient: bl.observationsClient || "",
        totalColis: bl.totalColis || 1,
        poidsTotal: bl.poidsTotal || 0,
        volumeTotal: bl.volumeTotal || 0
      });
    }
  }, [bl, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!bl) return;

    try {
      updateBL(bl.id, formData);
      onOpenChange(false);
      
      toast.success("BL modifié", {
        description: `Les modifications du BL ${bl.id} ont été sauvegardées.`
      });
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de sauvegarder les modifications."
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_preparation": return "bg-blue-100 text-blue-800";
      case "expedie": return "bg-orange-100 text-orange-800";
      case "en_cours_livraison": return "bg-amber-100 text-amber-800";
      case "livre": return "bg-green-100 text-green-800";
      case "partiellement_livre": return "bg-yellow-100 text-yellow-800";
      case "refuse": return "bg-red-100 text-red-800";
      case "retour": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_preparation": return "En préparation";
      case "expedie": return "Expédié";
      case "en_cours_livraison": return "En cours de livraison";
      case "livre": return "Livré";
      case "partiellement_livre": return "Partiellement livré";
      case "refuse": return "Refusé";
      case "retour": return "En retour";
      default: return status;
    }
  };

  if (!bl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Truck className="h-6 w-6 text-blue-600" />
            Modifier le BL {bl.id}
          </DialogTitle>
          <DialogDescription>
            Modification des informations du bon de livraison pour <span className="font-semibold">{bl.client}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Informations client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Nom du client</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => handleInputChange("client", e.target.value)}
                    placeholder="Nom du client"
                  />
                </div>
                <div>
                  <Label htmlFor="clientPhone">Téléphone</Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                    placeholder="+212 6 XX XX XX XX"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientAdresse">Adresse de livraison</Label>
                  <Textarea
                    id="clientAdresse"
                    value={formData.clientAdresse}
                    onChange={(e) => handleInputChange("clientAdresse", e.target.value)}
                    placeholder="Adresse complète de livraison"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations livraison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                Informations livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dateLivraison">Date de livraison</Label>
                  <Input
                    id="dateLivraison"
                    value={formData.dateLivraison}
                    onChange={(e) => handleInputChange("dateLivraison", e.target.value)}
                    placeholder="JJ/MM/AAAA"
                  />
                </div>
                <div>
                  <Label htmlFor="livreur">Livreur</Label>
                  <Input
                    id="livreur"
                    value={formData.livreur}
                    onChange={(e) => handleInputChange("livreur", e.target.value)}
                    placeholder="Nom du livreur"
                  />
                </div>
                <div>
                  <Label htmlFor="transporteur">Transporteur</Label>
                  <Input
                    id="transporteur"
                    value={formData.transporteur}
                    onChange={(e) => handleInputChange("transporteur", e.target.value)}
                    placeholder="Nom du transporteur"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicule">Véhicule (immatriculation)</Label>
                  <Input
                    id="vehicule"
                    value={formData.vehicule}
                    onChange={(e) => handleInputChange("vehicule", e.target.value)}
                    placeholder="123-A-45"
                  />
                </div>
                <div>
                  <Label htmlFor="modeLivraison">Mode de livraison</Label>
                  <Select value={formData.modeLivraison} onValueChange={(value) => handleInputChange("modeLivraison", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="livraison_directe">Livraison directe</SelectItem>
                      <SelectItem value="transporteur">Transporteur</SelectItem>
                      <SelectItem value="retrait_client">Retrait client</SelectItem>
                      <SelectItem value="coursier">Coursier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statut et informations complémentaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                Statut et informations complémentaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Statut du BL</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_preparation">En préparation</SelectItem>
                      <SelectItem value="expedie">Expédié</SelectItem>
                      <SelectItem value="en_cours_livraison">En cours de livraison</SelectItem>
                      <SelectItem value="livre">Livré</SelectItem>
                      <SelectItem value="partiellement_livre">Partiellement livré</SelectItem>
                      <SelectItem value="refuse">Refusé</SelectItem>
                      <SelectItem value="retour">En retour</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <Badge className={getStatusColor(formData.status)}>
                      {getStatusLabel(formData.status)}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="totalColis">Nombre de colis</Label>
                    <Input
                      id="totalColis"
                      type="number"
                      value={formData.totalColis}
                      onChange={(e) => handleInputChange("totalColis", parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="poidsTotal">Poids total (kg)</Label>
                  <Input
                    id="poidsTotal"
                    type="number"
                    step="0.1"
                    value={formData.poidsTotal}
                    onChange={(e) => handleInputChange("poidsTotal", parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label htmlFor="volumeTotal">Volume total (m³)</Label>
                  <Input
                    id="volumeTotal"
                    type="number"
                    step="0.01"
                    value={formData.volumeTotal}
                    onChange={(e) => handleInputChange("volumeTotal", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Observations et conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="conditionsLivraison">Conditions de livraison</Label>
                <Textarea
                  id="conditionsLivraison"
                  value={formData.conditionsLivraison}
                  onChange={(e) => handleInputChange("conditionsLivraison", e.target.value)}
                  placeholder="Conditions particulières de livraison..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="observationsGenerales">Observations générales</Label>
                <Textarea
                  id="observationsGenerales"
                  value={formData.observationsGenerales}
                  onChange={(e) => handleInputChange("observationsGenerales", e.target.value)}
                  placeholder="Observations générales sur la livraison..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="observationsClient">Observations client</Label>
                <Textarea
                  id="observationsClient"
                  value={formData.observationsClient}
                  onChange={(e) => handleInputChange("observationsClient", e.target.value)}
                  placeholder="Observations ou demandes spécifiques du client..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Package className="h-4 w-4" />
            Sauvegarder les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
