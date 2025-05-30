
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentContacts } from "@/components/dashboard/RecentContacts";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";
import { RecentBL } from "@/components/dashboard/RecentBL";
import { CreditCard, Receipt, Calendar, AlertTriangle, Users, Package, Search, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import { RecentQuotes } from "@/components/dashboard/RecentQuotes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const showStockAlert = () => {
    toast.warning("Stock critique", {
      description: "5 produits sont en niveau de stock critique. Veuillez consulter la section Inventaire.",
    });
  };

  const showInvoiceAlert = () => {
    toast.info("Factures impayées", {
      description: "3 factures sont en retard de paiement. Veuillez consulter la section Devis/Factures."
    });
  };

  // Données de recherche globale
  const searchableData = [
    // Clients
    { type: 'client', name: 'Société ABC', description: 'Client entreprise', route: '/contacts' },
    { type: 'client', name: 'Event Pro Services', description: 'Agence événementiel', route: '/contacts' },
    { type: 'client', name: 'Hotel Marrakech', description: 'Hôtel de luxe', route: '/contacts' },

    // Devis
    { type: 'devis', name: 'DEVIS-25-001', description: 'Société ABC - 15 000 MAD', route: '/quotes' },
    { type: 'devis', name: 'DEVIS-25-002', description: 'Event Pro Services - 8 500 MAD', route: '/quotes' },

    // Factures
    { type: 'facture', name: 'INV-001', description: 'Société ABC - 15 000 MAD', route: '/invoices' },
    { type: 'facture', name: 'INV-002', description: 'Event Pro Services - 8 500 MAD', route: '/invoices' },

    // BL
    { type: 'bl', name: 'BL-25-001', description: 'Société ABC - Livré', route: '/bon-livraison' },
    { type: 'bl', name: 'BL-25-002', description: 'Event Pro Services - En cours', route: '/bon-livraison' },

    // Produits
    { type: 'produit', name: 'Écran tactile 55"', description: 'Équipement tactile', route: '/products' },
    { type: 'produit', name: 'Borne interactive', description: 'Borne libre-service', route: '/products' },

    // Événements
    { type: 'événement', name: 'Installation Centre Anfa', description: '10/05/2025 - Karim H.', route: '/events' },
    { type: 'événement', name: 'Maintenance Banque Populaire', description: '11/05/2025 - Mohamed T.', route: '/events' },
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = searchableData.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.description.toLowerCase().includes(term.toLowerCase()) ||
      item.type.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleSearchResultClick = (result: any) => {
    navigate(result.route);
    setShowSearchResults(false);
    setSearchTerm("");
    toast.success("Navigation", {
      description: `Redirection vers ${result.type}: ${result.name}`
    });
  };

  React.useEffect(() => {
    // Afficher les alertes après 2 secondes
    const timer = setTimeout(() => {
      showStockAlert();
      setTimeout(() => {
        showInvoiceAlert();
      }, 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout title="Tableau de bord">
      <div className="space-y-6">
        {/* En-tête personnalisé */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Bonjour {user?.name?.split(' ')[0] || 'Utilisateur'} 👋
            </h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de votre activité CRM - {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Barre de recherche globale */}
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher dans le CRM..."
                className="pl-8 bg-white border-gray-200 w-full"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
              />

              {/* Résultats de recherche */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleSearchResultClick(result)}
                    >
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{result.name}</div>
                        <div className="text-xs text-gray-500">{result.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Message si aucun résultat */}
              {showSearchResults && searchResults.length === 0 && searchTerm.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4 text-center text-gray-500 text-sm">
                  Aucun résultat trouvé pour "{searchTerm}"
                </div>
              )}
            </div>

            <Badge variant="outline" className="bg-green-100 text-green-800 whitespace-nowrap">
              {user?.role === 'admin' ? 'Administrateur' :
               user?.role === 'manager' ? 'Manager' : 'Employé'}
            </Badge>
          </div>
        </div>

        {/* Fermer les résultats en cliquant ailleurs */}
        {showSearchResults && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSearchResults(false)}
          />
        )}

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Vue générale</TabsTrigger>
            <TabsTrigger value="ventes">Ventes</TabsTrigger>
            <TabsTrigger value="operations">Opérations</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Chiffre d'affaires mensuel"
                value="152 000 MAD"
                icon={<CreditCard className="h-4 w-4 text-gray-500" />}
                trend={{ value: 12, positive: true }}
              />
              <StatCard
                title="Factures en attente"
                value="7"
                icon={<Receipt className="h-4 w-4 text-gray-500" />}
                description="3 factures en retard"
              />
              <StatCard
                title="Avances encaissées"
                value="45 000 MAD"
                icon={<CreditCard className="h-4 w-4 text-gray-500" />}
                trend={{ value: 8, positive: true }}
              />
              <StatCard
                title="Clients du mois"
                value="15"
                icon={<Users className="h-4 w-4 text-gray-500" />}
                trend={{ value: 5, positive: true }}
              />
            </div>

            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <SalesChart />
              <RecentQuotes />
            </div>

            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <RecentContacts />
              <UpcomingEvents />
            </div>

            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <InventoryStatus />
              <RecentBL />
            </div>
          </TabsContent>

          <TabsContent value="ventes">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="CA Annuel (prévision)"
                value="1.8M MAD"
                icon={<CreditCard className="h-4 w-4 text-gray-500" />}
                trend={{ value: 15, positive: true }}
              />
              <StatCard
                title="Taux de conversion"
                value="28%"
                icon={<Users className="h-4 w-4 text-gray-500" />}
                trend={{ value: 3, positive: true }}
              />
              <StatCard
                title="Panier moyen"
                value="25 000 MAD"
                icon={<CreditCard className="h-4 w-4 text-gray-500" />}
                trend={{ value: 2, positive: false }}
              />
              <StatCard
                title="Devis émis"
                value="28"
                icon={<Receipt className="h-4 w-4 text-gray-500" />}
                trend={{ value: 12, positive: true }}
              />
            </div>

            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex justify-between">
                    <span>Activité commerciale</span>
                    <Link to="/analytics">
                      <Button variant="ghost" size="sm">Voir détails</Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Leads qualifiés ce mois</div>
                      <div>24</div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Appels commerciaux</div>
                      <div>45</div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Rendez-vous planifiés</div>
                      <div>12</div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Taux de signature</div>
                      <div>32%</div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Leads Facebook</div>
                      <div>18</div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Leads LinkedIn</div>
                      <div>7</div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Leads Instagram</div>
                      <div>5</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Top commerciaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold mr-3">YA</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Youssef Alami</div>
                        <div className="text-sm text-muted-foreground">240 000 MAD</div>
                      </div>
                      <Badge>Top ventes</Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold mr-3">FB</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Fatima Benkirane</div>
                        <div className="text-sm text-muted-foreground">180 000 MAD</div>
                      </div>
                      <Badge variant="outline">2ème</Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold mr-3">SZ</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Sara Zouiten</div>
                        <div className="text-sm text-muted-foreground">140 000 MAD</div>
                      </div>
                      <Badge variant="outline">3ème</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-green-500 pl-4 py-1">
                      <p className="text-sm font-medium">Devis accepté - Hotel Marrakech</p>
                      <p className="text-xs text-muted-foreground">Aujourd'hui, 11:20 - 22 000 MAD</p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-4 py-1">
                      <p className="text-sm font-medium">Nouveau lead Facebook - Restaurant Le Majestic</p>
                      <p className="text-xs text-muted-foreground">Aujourd'hui, 09:45 - Attribué à Fatima B.</p>
                    </div>
                    <div className="border-l-2 border-amber-500 pl-4 py-1">
                      <p className="text-sm font-medium">Appel commercial - Centre commercial Anfa</p>
                      <p className="text-xs text-muted-foreground">Hier, 15:30 - Youssef A.</p>
                    </div>
                    <div className="border-l-2 border-red-500 pl-4 py-1">
                      <p className="text-sm font-medium">Facture impayée - Event Pro Services</p>
                      <p className="text-xs text-muted-foreground">Hier, 14:20 - 8 500 MAD - Échéance dépassée</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Équipements actifs"
                value="45"
                icon={<Package className="h-4 w-4 text-gray-500" />}
                trend={{ value: 5, positive: true }}
              />
              <StatCard
                title="Équipements en location"
                value="18"
                icon={<Package className="h-4 w-4 text-gray-500" />}
                description="40% du stock total"
              />
              <StatCard
                title="Maintenances prévues"
                value="8"
                icon={<Calendar className="h-4 w-4 text-gray-500" />}
                description="Cette semaine"
              />
              <StatCard
                title="Alertes de stock"
                value="5"
                icon={<AlertTriangle className="h-4 w-4 text-gray-500" />}
                description="Niveau critique"
              />
            </div>

            <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Équipements en stock critique</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Écran tactile 55"</div>
                        <div className="text-xs text-muted-foreground">En stock: 2</div>
                      </div>
                      <Badge variant="destructive">Critique</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Borne interactive 43"</div>
                        <div className="text-xs text-muted-foreground">En stock: 1</div>
                      </div>
                      <Badge variant="destructive">Critique</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Écran OLED transparent</div>
                        <div className="text-xs text-muted-foreground">En stock: 0</div>
                      </div>
                      <Badge variant="destructive">Rupture</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Stands de table</div>
                        <div className="text-xs text-muted-foreground">En stock: 3</div>
                      </div>
                      <Badge variant="destructive">Critique</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Câbles HDMI 5m</div>
                        <div className="text-xs text-muted-foreground">En stock: 4</div>
                      </div>
                      <Badge variant="destructive">Critique</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Techniciens assignés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold mr-2">KH</div>
                        <div>
                          <div className="text-sm font-medium">Karim Hassan</div>
                          <div className="text-xs text-muted-foreground">Installation</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Disponible</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold mr-2">MT</div>
                        <div>
                          <div className="text-sm font-medium">Mohamed Toumi</div>
                          <div className="text-xs text-muted-foreground">Maintenance</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">En mission</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold mr-2">RL</div>
                        <div>
                          <div className="text-sm font-medium">Rachid Lamrani</div>
                          <div className="text-xs text-muted-foreground">Installation</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">En mission</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold mr-2">LB</div>
                        <div>
                          <div className="text-sm font-medium">Layla Bensaid</div>
                          <div className="text-xs text-muted-foreground">Support</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Disponible</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Retours à prévoir</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Écrans tactiles (5)</div>
                        <div className="text-xs text-muted-foreground">Salon Média - Casablanca</div>
                      </div>
                      <div className="text-sm">12/05/2025</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Bornes interactives (3)</div>
                        <div className="text-xs text-muted-foreground">Exposition Agritech</div>
                      </div>
                      <div className="text-sm">15/05/2025</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Table tactile (1)</div>
                        <div className="text-xs text-muted-foreground">Hotel Marrakech</div>
                      </div>
                      <div className="text-sm">22/05/2025</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Écrans OLED (2)</div>
                        <div className="text-xs text-muted-foreground">Lancement produit Tanger</div>
                      </div>
                      <div className="text-sm">30/05/2025</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex justify-between">
                  <span>Interventions techniques prévues</span>
                  <Link to="/events">
                    <Button variant="ghost" size="sm">Voir tout</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Installation</Badge>
                        <div className="text-xs">10/05/2025</div>
                      </div>
                      <div className="text-sm font-medium">Centre commercial Anfa</div>
                      <div className="text-xs text-muted-foreground">Borne interactive 55" + Écrans</div>
                      <div className="text-xs mt-2">Technicien: Karim H.</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Maintenance</Badge>
                        <div className="text-xs">11/05/2025</div>
                      </div>
                      <div className="text-sm font-medium">Banque Populaire - Agence Centrale</div>
                      <div className="text-xs text-muted-foreground">Mise à jour logiciel + nettoyage</div>
                      <div className="text-xs mt-2">Technicien: Mohamed T.</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Formation</Badge>
                        <div className="text-xs">14/05/2025</div>
                      </div>
                      <div className="text-sm font-medium">Hôtel Royal - Rabat</div>
                      <div className="text-xs text-muted-foreground">Formation personnel systèmes tactiles</div>
                      <div className="text-xs mt-2">Technicien: Layla B.</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>


      </div>
    </Layout>
  );
};

export default Index;
