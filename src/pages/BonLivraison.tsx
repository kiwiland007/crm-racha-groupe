import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBLContext } from "@/contexts/BLContext";
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
  DropdownMenuLabel,
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
import { BonLivraison as BonLivraisonType } from "@/contexts/InvoiceContext"; // Import the type
import { BLEditModal } from "@/components/bon-livraison/BLEditModal";
import { BLCreateModal } from "@/components/bon-livraison/BLCreateModal";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BonLivraison() {
  const isMobile = useIsMobile();
  const { bonLivraisons, updateBL, deleteBL, updateBLStatus } = useBLContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showBLDetails, setShowBLDetails] = useState(false);
  const [selectedBL, setSelectedBL] = useState<BonLivraisonType | null>(null);
  const [editingBL, setEditingBL] = useState<BonLivraisonType | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Utilisation des BL depuis le contexte

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

  const handleCreateBL = () => {
    setShowCreateModal(true);
  };

  const handleViewDetails = (bl: BonLivraisonType) => {
    setSelectedBL(bl);
    setShowBLDetails(true);
  };

  const handleEditBL = (bl: BonLivraisonType) => {
    setEditingBL(bl);
    setShowEditModal(true);
  };

  const handleGeneratePDF = async (bl: BonLivraisonType) => {
    try {
      console.log("=== DÉBUT GÉNÉRATION PDF BL ===");
      console.log("Données BL reçues:", bl);

      // Import dynamique du service BL
      const { bonLivraisonService } = await import("@/services/bonLivraisonService");

      // Préparer les données pour le service BL avec structure correcte
      const blData = {
        id: bl.id,
        factureId: bl.factureId,
        devisId: bl.devisId, // Optionnel

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

  const handleDeleteBL = (bl: BonLivraisonType) => {
    deleteBL(bl.id);
  };

  const filteredBLs = bonLivraisons.filter(bl => {
    const matchesSearch = bl.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bl.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (bl.factureId && bl.factureId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (bl.devisId && bl.devisId.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter size={16} />
                  Filtres
                  {statusFilter !== "all" && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                      1
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  <div className="flex items-center justify-between w-full">
                    Tous les BL
                    {statusFilter === "all" && <CheckCircle className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("en_preparation")}>
                  <div className="flex items-center justify-between w-full">
                    En préparation
                    {statusFilter === "en_preparation" && <CheckCircle className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pret_livraison")}>
                  <div className="flex items-center justify-between w-full">
                    Prêt à livrer
                    {statusFilter === "pret_livraison" && <CheckCircle className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("en_cours_livraison")}>
                  <div className="flex items-center justify-between w-full">
                    En cours de livraison
                    {statusFilter === "en_cours_livraison" && <CheckCircle className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("livre")}>
                  <div className="flex items-center justify-between w-full">
                    Livré
                    {statusFilter === "livre" && <CheckCircle className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("retour")}>
                  <div className="flex items-center justify-between w-full">
                    Retour
                    {statusFilter === "retour" && <CheckCircle className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  Effacer les filtres
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    <TableHead className={isMobile ? "hidden" : ""}>Facture</TableHead>
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
                      <TableCell className={isMobile ? "hidden" : ""}>{bl.factureId || '-'}</TableCell>
                      <TableCell className={isMobile ? "hidden" : ""}>{bl.devisId || '-'}</TableCell>
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

      <BLEditModal
        bl={editingBL}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />

      <BLCreateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </Layout>
  );
}
