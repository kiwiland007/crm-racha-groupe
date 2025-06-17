import React, { useState } from "react";
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
import { Truck, Package, User, Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import { useBLContext } from "@/contexts/BLContext";
import { BLItemsManager } from "./BLItemsManager";
import { QuoteItem } from "@/types";

interface BLCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormDataState {
  client: string;
  clientAdresse: string;
  clientPhone: string;
  clientEmail: string;
  dateLivraison: string;
  livreur: string;
  transporteur: string;
  vehicule: string;
  modeLivraison: string;
  status: string;
  conditionsLivraison: string;
  observationsGenerales: string;
  observationsClient: string;
  totalColis: number;
  poidsTotal: number;
  volumeTotal: number;
  items: QuoteItem[];
}

export function BLCreateModal({ open, onOpenChange }: BLCreateModalProps) {
  const { addBL } = useBLContext();
  
  const [formData, setFormData] = useState<FormDataState>({
    client: "",
    clientAdresse: "",
    clientPhone: "",
    clientEmail: "",
    dateLivraison: "",
    livreur: "",
    transporteur: "Transport interne",
    vehicule: "",
    modeLivraison: "livraison_directe",
    status: "en_preparation",
    conditionsLivraison: "",
    observationsGenerales: "",
    observationsClient: "",
    totalColis: 1,
    poidsTotal: 0,
    volumeTotal: 0,
    items: []
  });

  const handleInputChange = (field: keyof FormDataState, value: string | number | QuoteItem[] | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreate = async () => {
    // Validation
    if (!formData.client.trim()) {
      toast.error("Veuillez saisir le nom du client");
      return;
    }
    
    if (!formData.clientAdresse.trim()) {
      toast.error("Veuillez saisir l'adresse de livraison");
      return;
    }
    
    if (!formData.dateLivraison) {
      toast.error("Veuillez sélectionner une date de livraison");
      return;
    }
    
    if (formData.items.length === 0) {
      toast.error("Veuillez ajouter au moins un article à livrer");
      return;
    }

    try {
      // Import dynamique du service de numérotation
      const { numerotationService } = await import("@/services/numerotationService");
      
      // Générer un nouveau numéro BL
      const newBLNumber = numerotationService.generateBLNumber();
      
      // Créer le nouveau BL
      const newBL = {
        id: newBLNumber,
        factureId: `FACT-25-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
        devisId: `DEVIS-25-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
        dateCreation: new Date().toLocaleDateString('fr-FR'),
        signatureClient: false,
        signatureLivreur: false,
        ...formData
      };

      // Ajouter le BL via le contexte
      if (addBL) {
        addBL(newBL);
      }
      
      // Reset form
      setFormData({
        client: "",
        clientAdresse: "",
        clientPhone: "",
        clientEmail: "",
        dateLivraison: "",
        livreur: "",
        transporteur: "Transport interne",
        vehicule: "",
        modeLivraison: "livraison_directe",
        status: "en_preparation",
        conditionsLivraison: "",
        observationsGenerales: "",
        observationsClient: "",
        totalColis: 1,
        poidsTotal: 0,
        volumeTotal: 0,
        items: []
      });
      
      onOpenChange(false);
      
      toast.success("BL créé avec succès !", {
        description: `Bon de livraison ${newBLNumber} créé pour ${formData.client}`,
        action: {
          label: "Voir",
          onClick: () => console.log("Voir BL", newBLNumber)
        }
      });
    } catch (error) {
      console.error("Erreur création BL:", error);
      toast.error("Erreur lors de la création", {
        description: "Impossible de créer le bon de livraison"
      });
    }
  };

  // Générer une date par défaut (dans 3 jours)
  const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[1000px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-6 w-6 text-blue-600" />
            Créer un nouveau Bon de Livraison
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau bon de livraison
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
                  <Label htmlFor="client">Nom du client *</Label>
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
                  <Label htmlFor="clientAdresse">Adresse de livraison *</Label>
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
                  <Label htmlFor="dateLivraison">Date de livraison *</Label>
                  <Input
                    id="dateLivraison"
                    type="date"
                    value={formData.dateLivraison || defaultDate}
                    onChange={(e) => handleInputChange("dateLivraison", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="livreur">Livreur</Label>
                  <Select value={formData.livreur} onValueChange={(value) => handleInputChange("livreur", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un livreur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mohamed Alami">Mohamed Alami</SelectItem>
                      <SelectItem value="Karim Hassan">Karim Hassan</SelectItem>
                      <SelectItem value="Rachid Lamrani">Rachid Lamrani</SelectItem>
                      <SelectItem value="Youssef Benali">Youssef Benali</SelectItem>
                      <SelectItem value="Layla Bensaid">Layla Bensaid</SelectItem>
                    </SelectContent>
                  </Select>
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

          {/* Articles à livrer */}
          <BLItemsManager
            items={formData.items}
            onItemsChange={(items) => handleInputChange("items", items)}
          />

          {/* Observations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                Observations (optionnel)
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
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleCreate} className="gap-2">
            <Package className="h-4 w-4" />
            Créer le Bon de Livraison
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
