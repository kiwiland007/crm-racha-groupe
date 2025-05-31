import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Filter, 
  MoreVertical, 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Truck,
  Package,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import BonLivraisonDetails from "@/components/bon-livraison/BonLivraisonDetails";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BonLivraison() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showBLDetails, setShowBLDetails] = useState(false);
  const [selectedBL, setSelectedBL] = useState<any>(null);

  const [bonLivraisons, setBonLivraisons] = useState([
    {
      id: "BL-25-001",
      devisId: "DEVIS-25-001",
      client: "Société ABC",
      clientAdresse: "123 Rue Mohammed V, Casablanca",
      dateCreation: "05/01/2025",
      dateLivraison: "08/01/2025",
      livreur: "Mohamed Alami",
      transporteur: "Express Maroc",
      status: "livre",
      items: [
        {
          designation: "Écran tactile 55 pouces",
          quantiteCommandee: 3,
          quantiteLivree: 3,
          unite: "pcs"
        },
        {
          designation: "Support mural",
          quantiteCommandee: 3,
          quantiteLivree: 3,
          unite: "pcs"
        }
      ],
      totalColis: 6,
      signatureClient: true,
      signatureLivreur: true
    },
    {
      id: "BL-25-002",
      devisId: "DEVIS-25-002",
      client: "Event Pro Services",
      clientAdresse: "456 Avenue Hassan II, Rabat",
      dateCreation: "03/01/2025",
      dateLivraison: "06/01/2025",
      livreur: "Karim Hassan",
      transporteur: "Transport Direct",
      status: "en_cours_livraison",
      items: [
        {
          designation: "Borne interactive 43 pouces",
          quantiteCommandee: 2,
          quantiteLivree: 0,
          unite: "pcs"
        }
      ],
      totalColis: 2,
      signatureClient: false,
      signatureLivreur: true
    },
    {
      id: "BL-25-003",
      devisId: "DEVIS-25-003",
      client: "Hotel Marrakech",
      clientAdresse: "789 Boulevard Zerktouni, Marrakech",
      dateCreation: "02/01/2025",
      dateLivraison: "05/01/2025",
      livreur: "Rachid Lamrani",
      transporteur: "Livraison Express",
      status: "expedie",
      items: [
        {
          designation: "Table tactile 55 pouces",
          quantiteCommandee: 1,
          quantiteLivree: 0,
          unite: "pcs"
        },
        {
          designation: "Système audio",
          quantiteCommandee: 1,
          quantiteLivree: 0,
          unite: "pcs"
        }
      ],
      totalColis: 2,
      signatureClient: false,
      signatureLivreur: true
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_preparation":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 gap-1">
            <Clock size={12} />
            En préparation
          </Badge>
        );
      case "expedie":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100 gap-1">
            <Package size={12} />
            Expédié
          </Badge>
        );
      case "en_cours_livraison":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 gap-1">
            <Truck size={12} />
            En cours
          </Badge>
        );
      case "livre":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 gap-1">
            <CheckCircle size={12} />
            Livré
          </Badge>
        );
      case "partiellement_livre":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 gap-1">
            <AlertCircle size={12} />
            Partiel
          </Badge>
        );
      case "refuse":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 gap-1">
            <AlertCircle size={12} />
            Refusé
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <AlertCircle size={12} />
            {status}
          </Badge>
        );
    }
  };

  const handleCreateBL = async () => {
    try {
      console.log("=== CRÉATION NOUVEAU BL ===");

      // Import dynamique du service de numérotation
      const { numerotationService } = await import("@/services/numerotationService");

      // Générer un nouveau numéro BL
      const newBLNumber = numerotationService.generateBLNumber();
      console.log("Nouveau numéro BL généré:", newBLNumber);

      // Créer un nouveau BL avec des données par défaut
      const newBL = {
        id: newBLNumber,
        devisId: `DEVIS-25-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
        client: "Nouveau Client",
        clientAdresse: "Adresse à définir",
        dateCreation: new Date().toLocaleDateString('fr-FR'),
        dateLivraison: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'), // +3 jours
        livreur: "À assigner",
        transporteur: "À définir",
        status: "en_preparation",
        items: [
          {
            designation: "Article à définir",
            quantiteCommandee: 1,
            quantiteLivree: 0,
            unite: "pcs"
          }
        ],
        totalColis: 1,
        signatureClient: false,
        signatureLivreur: false
      };

      // Ajouter le nouveau BL à la liste
      setBonLivraisons([newBL, ...bonLivraisons]);

      toast.success("Nouveau BL créé !", {
        description: `BL ${newBLNumber} créé avec succès`,
        action: {
          label: "Modifier",
          onClick: () => handleEditBL(newBL)
        }
      });
    } catch (error) {
      console.error("Erreur création BL:", error);
      toast.error("Erreur création BL", {
        description: "Impossible de créer le bon de livraison"
      });
    }
  };

  const handleViewDetails = (bl: any) => {
    setSelectedBL(bl);
    setShowBLDetails(true);
  };

  const handleEditBL = (bl: any) => {
    toast.info("Modifier le BL", {
      description: `Modification du BL ${bl.id} - Fonctionnalité en développement`
    });
  };

  const handleGeneratePDF = async (bl: any) => {
    try {
      console.log("=== DÉBUT GÉNÉRATION PDF BL ===");
      console.log("Données BL reçues:", bl);

      // Import dynamique du service BL
      const { bonLivraisonService } = await import("@/services/bonLivraisonService");

      // Préparer les données pour le service BL avec structure correcte
      const blData = {
        id: bl.id,
        devisId: bl.devisId,

        // Informations client (format string, pas objet)
        client: bl.client,
        clientAddress: bl.clientAdresse || "Adresse non spécifiée",
        clientPhone: bl.clientPhone || "+212 6 XX XX XX XX",
        clientEmail: bl.clientEmail || "client@example.com",
        clientVille: bl.clientVille || "Casablanca",

        // Dates
        dateLivraison: bl.dateLivraison,
        dateCreation: bl.dateCreation,

        // Articles avec validation
        items: bl.items.map(item => ({
          designation: item.designation,
          quantiteCommandee: Number(item.quantiteCommandee) || 0,
          quantiteLivree: Number(item.quantiteLivree) || 0,
          unite: item.unite || "pcs",
          etat: "neuf" as const
        })),

        // Livraison
        livreur: bl.livreur,
        transporteur: bl.transporteur || "Transport interne",
        modeLivraison: "livraison_directe" as const,

        // Statut
        status: bl.status,
        signatureClient: bl.signatureClient || false,
        signatureLivreur: bl.signatureLivreur || false,

        // Informations complémentaires
        totalColis: bl.totalColis || 1
      };

      console.log("Données BL formatées:", blData);

      const result = bonLivraisonService.generateBonLivraison(blData);

      if (result) {
        console.log("✅ PDF BL généré avec succès:", result);
        toast.success("PDF BL généré !", {
          description: `BL ${bl.id} téléchargé avec succès`,
          action: {
            label: "Voir BL",
            onClick: () => console.log("Ouverture BL")
          }
        });
      } else {
        console.warn("⚠️ Génération BL retournée null");
        toast.error("Erreur génération PDF", {
          description: "Le service BL n'a pas pu générer le fichier"
        });
      }
    } catch (error) {
      console.error("❌ ERREUR GÉNÉRATION BL:", error);
      toast.error("Erreur génération PDF", {
        description: `Erreur: ${error.message || 'Problème technique'}`
      });
    }
  };

  const handleDeleteBL = (bl: any) => {
    const updatedBLs = bonLivraisons.filter(b => b.id !== bl.id);
    setBonLivraisons(updatedBLs);
    toast.success("BL supprimé", {
      description: `BL ${bl.id} supprimé avec succès`
    });
  };

  const filteredBLs = bonLivraisons.filter(bl => {
    const matchesSearch = bl.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bl.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bl.devisId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || bl.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout title="Bons de Livraison">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher des BL..."
                className="pl-8 bg-white border-gray-200 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
              <Filter size={16} />
              Filtres
            </Button>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button className="gap-2 flex-1 md:flex-auto" onClick={handleCreateBL}>
              <Plus size={16} />
              Nouveau BL
            </Button>
            <Button variant="outline" className="gap-2 flex-1 md:flex-auto">
              <FileText size={16} />
              {isMobile ? "PDF" : "Générer liste PDF"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bons de livraison récents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° BL</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Devis</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Date livraison</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Livreur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBLs.map((bl) => (
                    <TableRow key={bl.id}>
                      <TableCell className="font-medium">{bl.id}</TableCell>
                      <TableCell>{bl.client}</TableCell>
                      <TableCell className={isMobile ? "hidden" : ""}>{bl.devisId}</TableCell>
                      <TableCell className={isMobile ? "hidden" : ""}>{bl.dateLivraison}</TableCell>
                      <TableCell className={isMobile ? "hidden" : ""}>{bl.livreur}</TableCell>
                      <TableCell>{getStatusBadge(bl.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleGeneratePDF(bl)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Générer PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewDetails(bl)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditBL(bl)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteBL(bl)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <BonLivraisonDetails
        bonLivraison={selectedBL}
        open={showBLDetails}
        onOpenChange={setShowBLDetails}
        onGeneratePDF={handleGeneratePDF}
        onEdit={handleEditBL}
      />
    </Layout>
  );
}
