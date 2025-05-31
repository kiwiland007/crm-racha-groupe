
import React, { useState } from "react";
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
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertCircle, Filter, MoreVertical, Plus, Printer, QrCode, Search, Settings, Eye, Edit, Trash2, Package, Wrench, Download } from "lucide-react";
import QRCodeGenerator from "@/components/common/QRCodeGenerator";
import { EquipmentForm } from "@/components/inventory/EquipmentForm";
import { EquipmentDetails } from "@/components/inventory/EquipmentDetails";
import { EquipmentEditForm } from "@/components/inventory/EquipmentEditForm";
import { StockUpdateForm } from "@/components/inventory/StockUpdateForm";
import { MaintenanceForm } from "@/components/inventory/MaintenanceForm";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
// QR Code functionality moved to components

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItemForQR, setSelectedItemForQR] = useState<any>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);

  // Nouveaux états pour les modals
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  const allItems = [
    {
      id: 1,
      name: "Écran tactile 32\"",
      category: "Écran tactile",
      status: "disponible",
      quantity: 5,
      location: "Entrepôt principal",
      lastMaintenance: "15 Mar 2025",
      alert: false,
      price: {
        sale: 12000,
        rental: 2000
      }
    },
    {
      id: 2,
      name: "Borne interactive 43\"",
      category: "Borne",
      status: "loué",
      quantity: 0,
      location: "Client: MarketPro",
      lastMaintenance: "02 Avr 2025",
      alert: true,
      price: {
        sale: 35000,
        rental: 5000
      }
    },
    {
      id: 3,
      name: "Table tactile 55\"",
      category: "Table tactile",
      status: "disponible",
      quantity: 2,
      location: "Entrepôt principal",
      lastMaintenance: "10 Fév 2025",
      alert: true,
      price: {
        sale: 45000,
        rental: 6500
      }
    },
    {
      id: 4,
      name: "Écran LED extérieur",
      category: "Écran LED",
      status: "maintenance",
      quantity: 1,
      location: "Atelier technique",
      lastMaintenance: "30 Avr 2025",
      alert: false,
      price: {
        sale: 75000,
        rental: 12000
      }
    },
    {
      id: 5,
      name: "Borne photo 24\"",
      category: "Borne",
      status: "disponible",
      quantity: 3,
      location: "Entrepôt principal",
      lastMaintenance: "12 Mar 2025",
      alert: false,
      price: {
        sale: 18000,
        rental: 3000
      }
    },
  ];

  const [equipmentList, setEquipmentList] = useState(allItems);

  // Filtrer les items selon la recherche et les filtres
  const filteredItems = equipmentList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Obtenir les catégories uniques pour les filtres
  const categories = [...new Set(equipmentList.map(item => item.category))];

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

  const handleAddItem = () => {
    setShowEquipmentForm(true);
  };

  const handleAddEquipment = (equipmentData: any) => {
    const newEquipment = {
      id: equipmentList.length + 1,
      name: equipmentData.name,
      category: equipmentData.category,
      status: equipmentData.status,
      quantity: 1,
      location: equipmentData.location,
      lastMaintenance: equipmentData.purchaseDate,
      alert: false,
      price: {
        sale: equipmentData.purchasePrice,
        rental: Math.round(equipmentData.purchasePrice * 0.1) // 10% du prix de vente
      },
      serialNumber: equipmentData.serialNumber,
      purchaseDate: equipmentData.purchaseDate,
      notes: equipmentData.notes
    };

    setEquipmentList([...equipmentList, newEquipment]);

    toast.success("Équipement ajouté avec succès", {
      description: `${newEquipment.name} a été ajouté à l'inventaire`,
      action: {
        label: "Voir détails",
        onClick: () => toast.info("Détails", {
          description: `Équipement: ${newEquipment.name} - ${newEquipment.category}`
        })
      }
    });
  };

  const handleGenerateQR = (item?: any) => {
    if (item) {
      setSelectedItemForQR(item);
      setShowQRModal(true);
      toast.success("QR Code généré", {
        description: `QR Code pour ${item.name} affiché`
      });
    } else {
      // Générer QR pour tous les équipements
      toast.success("QR Codes générés", {
        description: `QR Codes pour ${filteredItems.length} équipements générés`,
        action: {
          label: "Télécharger tout",
          onClick: () => {
            filteredItems.forEach((equipment, index) => {
              setTimeout(() => {
                const qrData = JSON.stringify({
                  id: equipment.id,
                  name: equipment.name,
                  category: equipment.category,
                  status: equipment.status,
                  location: equipment.location,
                  price: equipment.price
                });

                // Créer un lien de téléchargement pour chaque QR
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  // Ici on pourrait générer le QR code et le télécharger
                  console.log(`QR généré pour ${equipment.name}:`, qrData);
                }
              }, index * 100); // Délai pour éviter la surcharge
            });
          }
        }
      });
    }
  };

  const handleViewDetails = (item: any) => {
    setSelectedEquipment(item);
    setShowDetailsModal(true);
  };

  const handleEditItem = (item: any) => {
    setSelectedEquipment(item);
    setShowEditModal(true);
  };

  const handleDeleteItem = (item: any) => {
    toast.error("Supprimer l'équipement", {
      description: `${item.name} sera supprimé`
    });
  };

  const handleUpdateStock = (item: any) => {
    setSelectedEquipment(item);
    setShowStockModal(true);
  };

  const handleAddMaintenance = (item: any) => {
    setSelectedEquipment(item);
    setShowMaintenanceModal(true);
  };

  // Nouvelles fonctions de gestion
  const handleSaveEquipment = (data: any) => {
    const updatedItems = equipmentList.map(item =>
      item.id === data.id
        ? {
            ...item,
            name: data.name,
            category: data.category,
            status: data.status,
            quantity: data.quantity,
            location: data.location,
            price: {
              sale: data.salePrice,
              rental: data.rentalPrice,
            },
            serialNumber: data.serialNumber,
            purchaseDate: data.purchaseDate,
            notes: data.notes,
          }
        : item
    );
    setEquipmentList(updatedItems);
    toast.success("Équipement modifié", {
      description: `${data.name} a été mis à jour avec succès`
    });
  };

  const handleSaveStock = (data: any) => {
    const updatedItems = equipmentList.map(item =>
      item.id === data.id
        ? { ...item, quantity: data.newQuantity }
        : item
    );
    setEquipmentList(updatedItems);
    toast.success("Stock mis à jour", {
      description: `${selectedEquipment?.name}: ${data.operation === 'add' ? '+' : data.operation === 'remove' ? '-' : '='} ${data.quantity} → ${data.newQuantity} unités`,
      action: {
        label: "Voir historique",
        onClick: () => toast.info("Historique", { description: `Raison: ${data.reason}` })
      }
    });
  };

  const handleSaveMaintenance = (data: any) => {
    // Mettre l'équipement en maintenance si ce n'est pas déjà le cas
    const updatedItems = equipmentList.map(item =>
      item.id === data.id && item.status !== "maintenance"
        ? { ...item, status: "maintenance", location: "Atelier technique" }
        : item
    );
    setEquipmentList(updatedItems);

    toast.success("Maintenance planifiée", {
      description: `${data.type === 'preventive' ? 'Maintenance préventive' : data.type === 'corrective' ? 'Maintenance corrective' : 'Maintenance d\'urgence'} programmée pour ${selectedEquipment?.name}`,
      action: {
        label: "Voir détails",
        onClick: () => toast.info("Maintenance", {
          description: `Date: ${new Date(data.scheduledDate).toLocaleDateString('fr-FR')} - Priorité: ${data.priority}`
        })
      }
    });
  };

  const handleReturnFromRental = (item: any) => {
    const updatedItems = equipmentList.map(equipment =>
      equipment.id === item.id
        ? { ...equipment, status: "disponible", location: "Entrepôt principal", quantity: equipment.quantity + 1 }
        : equipment
    );
    setEquipmentList(updatedItems);

    toast.success("Retour enregistré", {
      description: `${item.name} marqué comme retourné et disponible`,
      action: {
        label: "Voir équipement",
        onClick: () => handleViewDetails(item)
      }
    });
  };

  const handleFinishMaintenance = (item: any) => {
    const updatedItems = equipmentList.map(equipment =>
      equipment.id === item.id
        ? {
            ...equipment,
            status: "disponible",
            location: "Entrepôt principal",
            lastMaintenance: new Date().toLocaleDateString('fr-FR'),
            alert: false
          }
        : equipment
    );
    setEquipmentList(updatedItems);

    toast.success("Maintenance terminée", {
      description: `${item.name} remis en service et disponible`,
      action: {
        label: "Voir équipement",
        onClick: () => handleViewDetails(item)
      }
    });
  };

  const handleExport = () => {
    try {
      // Préparer les données pour l'export
      const exportData = filteredItems.map(item => ({
        ID: item.id,
        Nom: item.name,
        Catégorie: item.category,
        Statut: item.status,
        Quantité: item.quantity,
        Emplacement: item.location,
        'Prix Vente (MAD)': item.price.sale,
        'Prix Location (MAD/jour)': item.price.rental,
        'Dernière Maintenance': item.lastMaintenance,
        Alerte: item.alert ? 'Oui' : 'Non'
      }));

      // Créer le contenu CSV avec BOM UTF-8 pour Excel
      const headers = Object.keys(exportData[0]).join(';'); // Utiliser ; pour Excel français
      const csvContent = exportData.map(row =>
        Object.values(row).map(value => {
          // Échapper les guillemets et virgules
          const stringValue = String(value || '');
          if (stringValue.includes(';') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(';')
      ).join('\n');

      // Ajouter BOM UTF-8 pour la compatibilité Excel
      const BOM = '\uFEFF';
      const fullCsvContent = `${BOM}${headers}\n${csvContent}`;

      // Créer et télécharger le fichier avec encodage UTF-8
      const blob = new Blob([fullCsvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventaire-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Export réussi", {
        description: `Inventaire exporté (${filteredItems.length} équipements)`,
        action: {
          label: "Voir fichier",
          onClick: () => toast.info("Fichier téléchargé", {
            description: "Vérifiez votre dossier de téléchargements"
          })
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error("Erreur d'export", {
        description: "Impossible d'exporter l'inventaire"
      });
    }
  };

  return (
    <Layout title="Inventaire">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">Tout l'inventaire</TabsTrigger>
            <TabsTrigger value="available">Disponible</TabsTrigger>
            <TabsTrigger value="rented">Loué</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          <div className="mt-2 md:mt-0">
            <Button className="gap-2" onClick={handleAddItem}>
              <Plus size={16} />
              Ajouter un équipement
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Rechercher dans l'inventaire..."
              className="pl-8 bg-white border-gray-200 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter size={16} />
                  Filtres
                  {(categoryFilter !== "all" || statusFilter !== "all") && (
                    <span className="ml-1 h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Filtres d'inventaire</h4>
                    <p className="text-sm text-muted-foreground">
                      Filtrez les équipements par catégorie et statut
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Catégorie</label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Statut</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="disponible">Disponible</SelectItem>
                          <SelectItem value="loué">Loué</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCategoryFilter("all");
                        setStatusFilter("all");
                        toast.info("Filtres réinitialisés");
                      }}
                    >
                      Réinitialiser
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowFilters(false);
                        toast.success("Filtres appliqués", {
                          description: `${filteredItems.length} équipements trouvés`
                        });
                      }}
                    >
                      Appliquer
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => handleGenerateQR()}>
              <QrCode size={16} />
              Générer QR
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
              <Printer size={16} />
              Exporter
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Équipement</TableHead>
                    <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden md:table-cell">Quantité</TableHead>
                    <TableHead className="hidden lg:table-cell">Emplacement</TableHead>
                    <TableHead className="hidden lg:table-cell">Prix vente</TableHead>
                    <TableHead className="hidden lg:table-cell">Prix location</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="flex items-center gap-2">
                        {item.name}
                        {item.alert && <AlertCircle className="h-4 w-4 text-amber-500" />}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.category}
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.quantity}</TableCell>
                      <TableCell className="hidden lg:table-cell">{item.location}</TableCell>
                      <TableCell className="hidden lg:table-cell">{item.price.sale.toLocaleString()} MAD</TableCell>
                      <TableCell className="hidden lg:table-cell">{item.price.rental.toLocaleString()} MAD/jour</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 z-50">
                            <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditItem(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleGenerateQR(item)}>
                              <QrCode className="mr-2 h-4 w-4" />
                              Générer QR code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdateStock(item)}>
                              <Package className="mr-2 h-4 w-4" />
                              Modifier le stock
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddMaintenance(item)}>
                              <Wrench className="mr-2 h-4 w-4" />
                              Ajouter maintenance
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteItem(item)}>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Équipement</TableHead>
                    <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden md:table-cell">Quantité</TableHead>
                    <TableHead className="hidden lg:table-cell">Emplacement</TableHead>
                    <TableHead className="hidden lg:table-cell">Prix vente</TableHead>
                    <TableHead className="hidden lg:table-cell">Prix location</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems
                    .filter((item) => item.status === "disponible")
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="flex items-center gap-2">
                          {item.name}
                          {item.alert && <AlertCircle className="h-4 w-4 text-amber-500" />}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.category}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.quantity}</TableCell>
                        <TableCell className="hidden lg:table-cell">{item.location}</TableCell>
                        <TableCell className="hidden lg:table-cell">{item.price.sale.toLocaleString()} MAD</TableCell>
                        <TableCell className="hidden lg:table-cell">{item.price.rental.toLocaleString()} MAD/jour</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 z-50">
                              <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleGenerateQR(item)}>
                                <QrCode className="mr-2 h-4 w-4" />
                                Générer QR code
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleUpdateStock(item)}>
                                <Package className="mr-2 h-4 w-4" />
                                Modifier le stock
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAddMaintenance(item)}>
                                <Wrench className="mr-2 h-4 w-4" />
                                Ajouter maintenance
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteItem(item)}>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar structure for rented and maintenance tabs */}
        <TabsContent value="rented">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Équipement</TableHead>
                    <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden lg:table-cell">Emplacement</TableHead>
                    <TableHead className="hidden lg:table-cell">Prix location</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems
                    .filter((item) => item.status === "loué")
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="flex items-center gap-2">
                          {item.name}
                          {item.alert && <AlertCircle className="h-4 w-4 text-amber-500" />}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.category}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="hidden lg:table-cell">{item.location}</TableCell>
                        <TableCell className="hidden lg:table-cell">{item.price.rental.toLocaleString()} MAD/jour</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 z-50">
                              <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReturnFromRental(item)}>
                                <Package className="mr-2 h-4 w-4" />
                                Enregistrer retour
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Équipement</TableHead>
                    <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden lg:table-cell">Emplacement</TableHead>
                    <TableHead className="hidden lg:table-cell">Dernière maintenance</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems
                    .filter((item) => item.status === "maintenance")
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="flex items-center gap-2">
                          {item.name}
                          {item.alert && <AlertCircle className="h-4 w-4 text-amber-500" />}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.category}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="hidden lg:table-cell">{item.location}</TableCell>
                        <TableCell className="hidden lg:table-cell">{item.lastMaintenance}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 z-50">
                              <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleFinishMaintenance(item)}>
                                <Wrench className="mr-2 h-4 w-4" />
                                Terminer la maintenance
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal QR Code */}
      {selectedItemForQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">QR Code - {selectedItemForQR.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedItemForQR(null);
                  setShowQRModal(false);
                }}
              >
                ✕
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <QRCodeGenerator
                value={JSON.stringify({
                  id: selectedItemForQR.id,
                  name: selectedItemForQR.name,
                  category: selectedItemForQR.category,
                  status: selectedItemForQR.status,
                  location: selectedItemForQR.location,
                  price: selectedItemForQR.price,
                  url: `${window.location.origin}/inventory/${selectedItemForQR.id}`
                })}
                size={200}
                level="M"
                includeMargin={true}
              />

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Scannez ce code pour accéder aux informations de l'équipement
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>ID:</strong> {selectedItemForQR.id}</p>
                  <p><strong>Catégorie:</strong> {selectedItemForQR.category}</p>
                  <p><strong>Statut:</strong> {selectedItemForQR.status}</p>
                  <p><strong>Emplacement:</strong> {selectedItemForQR.location}</p>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                onClick={() => {
                  // Télécharger le QR code
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const url = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `qr-${selectedItemForQR.name.replace(/\s+/g, '-').toLowerCase()}.png`;
                    link.click();
                    toast.success("QR Code téléchargé", {
                      description: `QR Code pour ${selectedItemForQR.name} téléchargé`
                    });
                  }
                }}
              >
                <Download size={16} />
                Télécharger le QR Code
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire d'ajout d'équipement */}
      <EquipmentForm
        open={showEquipmentForm}
        onOpenChange={setShowEquipmentForm}
        onAddEquipment={handleAddEquipment}
      />

      {/* Nouveaux composants modaux */}
      <EquipmentDetails
        equipment={selectedEquipment}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      />

      <EquipmentEditForm
        equipment={selectedEquipment}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSave={handleSaveEquipment}
      />

      <StockUpdateForm
        equipment={selectedEquipment}
        open={showStockModal}
        onOpenChange={setShowStockModal}
        onSave={handleSaveStock}
      />

      <MaintenanceForm
        equipment={selectedEquipment}
        open={showMaintenanceModal}
        onOpenChange={setShowMaintenanceModal}
        onSave={handleSaveMaintenance}
      />
    </Layout>
  );
}
