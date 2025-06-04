import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Cog, Clock, Users } from "lucide-react";
import { useProductContext } from "@/contexts/ProductContext";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  price: string;
  technicians: number;
  status: "active" | "inactive";
}

export default function Services() {
  const { categories } = useProductContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [openServiceForm, setOpenServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    duration: "",
    price: "",
    technicians: 1,
    status: "active" as "active" | "inactive"
  });

  // Services par défaut
  const defaultServices: Service[] = [
    {
      id: "SRV-001",
      name: "Installation Écran Tactile",
      description: "Installation complète d'écran tactile avec configuration logicielle",
      category: "7", // Installation & Configuration
      duration: "1 jour",
      price: "2500",
      technicians: 2,
      status: "active"
    },
    {
      id: "SRV-002",
      name: "Maintenance Préventive",
      description: "Maintenance préventive trimestrielle des équipements tactiles",
      category: "8", // Maintenance & Support
      duration: "0.5 jour",
      price: "1200",
      technicians: 1,
      status: "active"
    },
    {
      id: "SRV-003",
      name: "Formation Utilisateurs",
      description: "Formation des utilisateurs sur les équipements interactifs",
      category: "9", // Formation
      duration: "2 jours",
      price: "3000",
      technicians: 1,
      status: "active"
    },
    {
      id: "SRV-004",
      name: "Support Technique 24/7",
      description: "Support technique disponible 24h/24 et 7j/7",
      category: "8", // Maintenance & Support
      duration: "Continu",
      price: "5000",
      technicians: 3,
      status: "active"
    },
    {
      id: "SRV-005",
      name: "Configuration Réseau",
      description: "Configuration réseau et connectivité des bornes interactives",
      category: "7", // Installation & Configuration
      duration: "0.5 jour",
      price: "1800",
      technicians: 1,
      status: "active"
    }
  ];

  const [services, setServices] = useState<Service[]>([]);
  const STORAGE_KEY = 'crm_services';

  // Charger les services depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedServices = localStorage.getItem(STORAGE_KEY);
      if (savedServices) {
        const parsedServices = JSON.parse(savedServices);
        setServices(parsedServices);
      } else {
        // Si aucun service sauvegardé, utiliser les services par défaut
        setServices(defaultServices);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultServices));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
      setServices(defaultServices);
    }
  }, []);

  // Sauvegarder les services dans localStorage à chaque modification
  useEffect(() => {
    if (services.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des services:', error);
        toast.error('Erreur de sauvegarde', {
          description: 'Impossible de sauvegarder les services'
        });
      }
    }
  }, [services]);

  const serviceCategories = categories.filter(cat => cat.type === "service");

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Non définie";
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryName(service.category).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      duration: "",
      price: "",
      technicians: 1,
      status: "active"
    });
    setEditingService(null);
  };

  const handleAddService = () => {
    if (!formData.name.trim()) {
      toast.error("Le nom du service est requis");
      return;
    }

    const newService: Service = {
      id: `SRV-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      duration: formData.duration,
      price: formData.price,
      technicians: formData.technicians,
      status: formData.status
    };

    setServices([...services, newService]);
    toast.success("Service ajouté avec succès", {
      description: `Le service "${formData.name}" a été créé`
    });

    resetForm();
    setOpenServiceForm(false);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      duration: service.duration,
      price: service.price,
      technicians: service.technicians,
      status: service.status
    });
    setOpenServiceForm(true);
  };

  const handleUpdateService = () => {
    if (!formData.name.trim()) {
      toast.error("Le nom du service est requis");
      return;
    }

    if (!editingService) return;

    const updatedServices = services.map(service =>
      service.id === editingService.id
        ? {
            ...service,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            duration: formData.duration,
            price: formData.price,
            technicians: formData.technicians,
            status: formData.status
          }
        : service
    );

    setServices(updatedServices);
    toast.success("Service modifié avec succès", {
      description: `Le service "${formData.name}" a été mis à jour`
    });

    resetForm();
    setOpenServiceForm(false);
  };

  const handleDeleteService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    setServices(services.filter(s => s.id !== serviceId));
    toast.success("Service supprimé", {
      description: `Le service "${service.name}" a été supprimé`
    });
  };

  return (
    <Layout title="Services">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Services</h1>
            <p className="text-gray-600">Gestion des services et prestations</p>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              resetForm();
              setOpenServiceForm(true);
            }}
          >
            <Plus size={16} />
            Nouveau service
          </Button>
        </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold">{services.length}</p>
              </div>
              <Cog className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Services Actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {services.filter(s => s.status === "active").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Catégories</p>
                <p className="text-2xl font-bold">{serviceCategories.length}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Techniciens</p>
                <p className="text-2xl font-bold">
                  {services.reduce((total, service) => total + service.technicians, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Services</CardTitle>
          <CardDescription>
            Gérez vos services et prestations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Table des services */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Techniciens</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        {getCategoryName(service.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {service.duration}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {parseInt(service.price).toLocaleString()} MAD
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        {service.technicians}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(service.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire d'ajout/modification de service */}
      <Dialog open={openServiceForm} onOpenChange={(open) => {
        setOpenServiceForm(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Modifier le service" : "Nouveau service"}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? "Modifiez les informations du service"
                : "Créez un nouveau service pour votre catalogue"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom du service *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Installation écran tactile"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description détaillée du service..."
                className="min-h-[100px]"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {serviceCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Durée (jours)</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Sélectionner la durée</option>
                  <option value="0.5 jour">0.5 jour (demi-journée)</option>
                  <option value="1 jour">1 jour</option>
                  <option value="2 jours">2 jours</option>
                  <option value="3 jours">3 jours</option>
                  <option value="5 jours">5 jours (1 semaine)</option>
                  <option value="10 jours">10 jours (2 semaines)</option>
                  <option value="15 jours">15 jours</option>
                  <option value="30 jours">30 jours (1 mois)</option>
                  <option value="Continu">Continu</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Prix (MAD)</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Techniciens requis</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.technicians}
                  onChange={(e) => setFormData({ ...formData, technicians: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                className="w-full p-2 border rounded-md"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenServiceForm(false)}>
              Annuler
            </Button>
            <Button onClick={editingService ? handleUpdateService : handleAddService}>
              {editingService ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
}
