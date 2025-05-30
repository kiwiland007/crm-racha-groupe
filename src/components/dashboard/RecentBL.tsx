import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, FileText, MoreVertical, CheckCircle, Clock, Package, Search } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function RecentBL() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");

  const recentBL = [
    {
      id: "BL-25-001",
      devisId: "DEVIS-25-001",
      client: "Société ABC",
      dateLivraison: "08/01/2025",
      livreur: "Mohamed Alami",
      status: "livre",
      totalColis: 6
    },
    {
      id: "BL-25-002",
      devisId: "DEVIS-25-002",
      client: "Event Pro Services",
      dateLivraison: "06/01/2025",
      livreur: "Karim Hassan",
      status: "en_cours_livraison",
      totalColis: 2
    },
    {
      id: "BL-25-003",
      devisId: "DEVIS-25-003",
      client: "Hotel Marrakech",
      dateLivraison: "05/01/2025",
      livreur: "Rachid Lamrani",
      status: "expedie",
      totalColis: 2
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

  const handleGeneratePDF = (bl: any) => {
    toast.success("PDF généré", {
      description: `BL ${bl.id} téléchargé`
    });
  };

  const handleViewDetails = (bl: any) => {
    navigate('/bon-livraison');
    toast.info("Détails du BL", {
      description: `Redirection vers ${bl.id}`
    });
  };

  const handleTrackDelivery = (bl: any) => {
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
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle>Bons de Livraison récents</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8 h-8 text-sm"
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
            >
              Voir tous
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className={isMobile ? "px-2" : ""}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° BL</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className={isMobile ? "hidden" : ""}>Date</TableHead>
                <TableHead className={isMobile ? "hidden" : ""}>Livreur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBL.map((bl) => (
                <TableRow key={bl.id}>
                  <TableCell className="font-medium">{bl.id}</TableCell>
                  <TableCell>{bl.client}</TableCell>
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
      </CardContent>
    </Card>
  );
}
