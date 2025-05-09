
import React from "react";
import Layout from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentContacts } from "@/components/dashboard/RecentContacts";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";
import { CreditCard, Receipt, Calendar, AlertTriangle, Users, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import InvoiceForm from "./InvoiceForm";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Index = () => {
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
              <RecentInvoices />
            </div>
            
            <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
              <RecentContacts />
              <UpcomingEvents />
              <InventoryStatus />
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

        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <h2 className="text-2xl font-bold">Gestion des factures et devis</h2>
          <div className="flex gap-2">
            <Link to="/quotes">
              <Button variant="outline">Voir tous les devis</Button>
            </Link>
            <InvoiceForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
