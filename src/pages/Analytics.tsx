import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  BarChart2 
} from "lucide-react";

const salesData = [
  { month: "Jan", ventes: 45000, location: 27000 },
  { month: "Fév", ventes: 52000, location: 32000 },
  { month: "Mar", ventes: 48000, location: 30000 },
  { month: "Avr", ventes: 61000, location: 34000 },
  { month: "Mai", ventes: 55000, location: 31000 },
  { month: "Juin", ventes: 67000, location: 36000 },
  { month: "Juil", ventes: 72000, location: 42000 },
  { month: "Août", ventes: 69000, location: 39000 },
  { month: "Sep", ventes: 78000, location: 44000 },
  { month: "Oct", ventes: 81000, location: 46000 },
  { month: "Nov", ventes: 75000, location: 40000 },
  { month: "Déc", ventes: 85000, location: 48000 },
];

const clientsData = [
  { name: "Particuliers", value: 35 },
  { name: "Entreprises", value: 45 },
  { name: "Organismes publics", value: 20 },
];

const productsData = [
  { name: "Écrans tactiles", value: 35 },
  { name: "Bornes interactives", value: 25 },
  { name: "Tables tactiles", value: 15 },
  { name: "Murs vidéo", value: 10 },
  { name: "Accessoires", value: 15 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Analytics() {
  return (
    <Layout title="Analyse des données">
      <Tabs defaultValue="ventes" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="ventes" className="flex items-center gap-2">
            <DollarSign size={16} />
            <span className="hidden md:inline">Chiffre d'affaires</span>
            <span className="md:hidden">CA</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users size={16} />
            <span>Clients</span>
          </TabsTrigger>
          <TabsTrigger value="produits" className="flex items-center gap-2">
            <BarChart2 size={16} />
            <span>Produits</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ventes">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  CA Annuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,732,000 MAD</div>
                <p className="text-xs text-muted-foreground">
                  +15% par rapport à l'année dernière
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventes (équipements)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">652,000 MAD</div>
                <p className="text-xs text-muted-foreground">
                  +8% par rapport à l'année dernière
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">435,000 MAD</div>
                <p className="text-xs text-muted-foreground">
                  +22% par rapport à l'année dernière
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Services & Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">645,000 MAD</div>
                <p className="text-xs text-muted-foreground">
                  +18% par rapport à l'année dernière
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Évolution des revenus (MAD)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={salesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString()} MAD`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ventes"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Ventes"
                  />
                  <Line type="monotone" dataKey="location" stroke="#82ca9d" name="Location" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par type de client</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clientsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {clientsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Acquisition de clients (2025)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { mois: "Jan", nouveaux: 8 },
                      { mois: "Fév", nouveaux: 12 },
                      { mois: "Mar", nouveaux: 5 },
                      { mois: "Avr", nouveaux: 9 },
                      { mois: "Mai", nouveaux: 14 },
                      { mois: "Juin", nouveaux: 10 },
                      { mois: "Juil", nouveaux: 7 },
                      { mois: "Août", nouveaux: 4 },
                      { mois: "Sep", nouveaux: 6 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="nouveaux" name="Nouveaux clients" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Fidélité client</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { duree: "<1 an", clients: 35 },
                    { duree: "1-2 ans", clients: 28 },
                    { duree: "2-3 ans", clients: 22 },
                    { duree: "3-4 ans", clients: 15 },
                    { duree: ">4 ans", clients: 10 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="duree" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clients" name="Nombre de clients" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="produits">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des ventes par produit</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>État du stock par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { categorie: "Écrans", stock: 24, critique: 5 },
                      { categorie: "Bornes", stock: 18, critique: 3 },
                      { categorie: "Tables", stock: 12, critique: 2 },
                      { categorie: "Murs vidéo", stock: 8, critique: 2 },
                      { categorie: "Accessoires", stock: 45, critique: 10 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categorie" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="stock" name="Disponible" fill="#82ca9d" />
                    <Bar dataKey="critique" name="Stock critique" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Évolution du taux d'utilisation (location)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { mois: "Jan", tx_utilisation: 65 },
                    { mois: "Fév", tx_utilisation: 72 },
                    { mois: "Mar", tx_utilisation: 68 },
                    { mois: "Avr", tx_utilisation: 75 },
                    { mois: "Mai", tx_utilisation: 82 },
                    { mois: "Juin", tx_utilisation: 88 },
                    { mois: "Juil", tx_utilisation: 92 },
                    { mois: "Août", tx_utilisation: 78 },
                    { mois: "Sep", tx_utilisation: 85 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tx_utilisation"
                    name="Taux d'utilisation"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
