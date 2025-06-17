import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, FileText, MoreVertical, CheckCircle, Clock, Package, Search, Calendar, User, Hash } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecentBLItem {
  id: string;
  devisId: string;
  client: string;
  dateLivraison: string;
  livreur: string;
  status: string;
  totalColis: number;
  montant: string;
  adresse: string;
}

export function RecentBL() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");

  const recentBL: RecentBLItem[] = [
    {
      id: "BL-25-001",
      devisId: "DEVIS-25-001",
      client: "Société ABC",
      dateLivraison: "08/01/2025",
      livreur: "Mohamed Alami",
      status: "livre",
      totalColis: 6,
      montant: "15 000 MAD",
      adresse: "Casablanca, Maarif"
    },
    {
      id: "BL-25-002",
      devisId: "DEVIS-25-002",
      client: "Event Pro Services",
      dateLivraison: "06/01/2025",
      livreur: "Karim Hassan",
      status: "en_cours_livraison",
      totalColis: 2,
      montant: "8 500 MAD",
      adresse: "Rabat, Agdal"
    },
    {
      id: "BL-25-003",
      devisId: "DEVIS-25-003",
      client: "Hotel Marrakech",
      dateLivraison: "05/01/2025",
      livreur: "Rachid Lamrani",
      status: "expedie",
      totalColis: 2,
      montant: "22 000 MAD",
      adresse: "Marrakech, Gueliz"
    },
    {
      id: "BL-25-004",
      devisId: "DEVIS-25-004",
      client: "Restaurant Le Majestic",
      dateLivraison: "04/01/2025",
      livreur: "Youssef Benali",
      status: "en_preparation",
      totalColis: 3,
      montant: "12 500 MAD",
      adresse: "Casablanca, Centre-ville"
    },
    {
      id: "BL-25-005",
      devisId: "DEVIS-25-005",
      client: "Centre Commercial Anfa",
      dateLivraison: "03/01/2025",
      livreur: "Layla Bensaid",
      status: "livre",
      totalColis: 8,
      montant: "35 000 MAD",
      adresse: "Casablanca, Anfa"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_preparation":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 gap-1">
            <Clock size={10} />
            Préparation
          </Badge>
        );
      case "expedie":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100 gap-1">
            <Package size={10} />
            Expédié
          </Badge>
        );
      case "en_cours_livraison":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 gap-1">
            <Truck size={10} />
            En cours
          </Badge>
        );
      case "livre":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 gap-1">
            <CheckCircle size={10} />
            Livré
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleGeneratePDF = (bl: RecentBLItem) => {
    toast.success("PDF généré", {
      description: `BL ${bl.id} téléchargé`
    });
  };

  const handleViewDetails = (bl: RecentBLItem) => {
    navigate('/bon-livraison');
    toast.info("Détails du BL", {
      description: `Redirection vers ${bl.id}`
    });
  };

  const handleTrackDelivery = (bl: RecentBLItem) => {
    toast.info("Suivi livraison", {
      description: `Suivi du BL ${bl.id} - Livreur: ${bl.livreur}`
    });
  };

  // Filtrer les BL selon le terme de recherche
  const filteredBL = recentBL.filter(bl =>
    bl.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bl.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bl.livreur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Bons de Livraison récents</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {filteredBL.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher BL..."
                className="pl-8 h-8 text-sm border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigate('/bon-livraison');
                toast.success("Redirection vers les BL");
              }}
              className="whitespace-nowrap"
            >
              Voir tous
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className={isMobile ? "px-2" : "px-6"}>
        {isMobile ? (
          // Vue mobile : cartes
          <div className="space-y-3">
            {filteredBL.slice(0, 3).map((bl) => (
              <div key={bl.id} className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-sm">{bl.id}</span>
                  </div>
                  {getStatusBadge(bl.status)}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="font-medium">{bl.client}</div>
                  <div className="text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {bl.dateLivraison}
                  </div>
                  <div className="text-gray-600 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {bl.livreur}
                  </div>
                  <div className="font-medium text-blue-600">{bl.montant}</div>
                </div>
                <div className="flex justify-end mt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleGeneratePDF(bl)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Générer PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewDetails(bl)}>
                        <Truck className="mr-2 h-4 w-4" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTrackDelivery(bl)}>
                        <Package className="mr-2 h-4 w-4" />
                        Suivi livraison
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Vue desktop : tableau amélioré
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="font-medium text-gray-700">N° BL</TableHead>
                  <TableHead className="font-medium text-gray-700">Client & Adresse</TableHead>
                  <TableHead className="font-medium text-gray-700">Date & Livreur</TableHead>
                  <TableHead className="font-medium text-gray-700">Montant</TableHead>
                  <TableHead className="font-medium text-gray-700">Colis</TableHead>
                  <TableHead className="font-medium text-gray-700">Statut</TableHead>
                  <TableHead className="font-medium text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBL.slice(0, 5).map((bl) => (
                  <TableRow key={bl.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-blue-600">{bl.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{bl.client}</div>
                        <div className="text-sm text-gray-500">{bl.adresse}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {bl.dateLivraison}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <User className="h-3 w-3 text-gray-400" />
                          {bl.livreur}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">{bl.montant}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{bl.totalColis}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(bl.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleGeneratePDF(bl)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Générer PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewDetails(bl)}>
                            <Truck className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTrackDelivery(bl)}>
                            <Package className="mr-2 h-4 w-4" />
                            Suivi livraison
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {filteredBL.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Aucun bon de livraison trouvé</p>
            {searchTerm && (
              <p className="text-xs mt-1">pour "{searchTerm}"</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
