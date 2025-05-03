
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
import { AlertCircle, Filter, MoreVertical, Plus, Printer, QrCode, Search } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Inventory() {
  const items = [
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
    toast.info("Fonctionnalité à venir", {
      description: "L'ajout d'équipement sera bientôt disponible."
    });
  };

  const handleGenerateQR = () => {
    toast.info("Fonctionnalité à venir", {
      description: "La génération de QR codes sera bientôt disponible."
    });
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
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter size={16} />
              Filtres
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleGenerateQR}>
              <QrCode size={16} />
              Générer QR
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
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
                  {items.map((item) => (
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
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir détails</DropdownMenuItem>
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuItem>Générer QR code</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Modifier le stock</DropdownMenuItem>
                            <DropdownMenuItem>Ajouter maintenance</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
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
                  {items
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
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Voir détails</DropdownMenuItem>
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuItem>Générer QR code</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Modifier le stock</DropdownMenuItem>
                              <DropdownMenuItem>Ajouter maintenance</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
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
                  {items
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
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Voir détails</DropdownMenuItem>
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuItem>Enregistrer retour</DropdownMenuItem>
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
                  {items
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
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Voir détails</DropdownMenuItem>
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuItem>Terminer la maintenance</DropdownMenuItem>
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
    </Layout>
  );
}
