import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  Plus,
  MoreVertical,
  Download,
  Edit,
  Eye,
  Trash2,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import { TechnicalSheetForm } from "@/components/equipment/TechnicalSheetForm";
import { TechnicalSheetDetails } from "@/components/equipment/TechnicalSheetDetails";
import { technicalSheetPDFService } from "@/services/technicalSheetPDFService";

export default function TechnicalSheets() {
  const [openForm, setOpenForm] = useState(false);
  const [editingSheet, setEditingSheet] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingSheet, setViewingSheet] = useState<any>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const [technicalSheets, setTechnicalSheets] = useState([
    {
      id: "1",
      name: "Écran Tactile 55 pouces",
      model: "ST-55-4K",
      brand: "Samsung",
      category: "ecran-tactile",
      description: "Écran tactile haute définition 4K avec technologie capacitive multi-touch",
      specifications: [
        { name: "Taille", value: "55", unit: "pouces" },
        { name: "Résolution", value: "3840x2160", unit: "pixels" },
        { name: "Luminosité", value: "500", unit: "cd/m²" },
        { name: "Contraste", value: "4000:1", unit: "" },
        { name: "Points de touch", value: "20", unit: "" },
      ],
      dimensions: {
        length: "1230",
        width: "710",
        height: "85",
        weight: "35",
      },
      powerRequirements: {
        voltage: "100-240V",
        power: "180W",
        frequency: "50/60Hz",
      },
      connectivity: ["HDMI", "USB", "Ethernet", "WiFi"],
      operatingConditions: {
        temperature: "0°C à 40°C",
        humidity: "10% à 80%",
      },
      warranty: "3 ans constructeur",
      certifications: ["CE", "FCC", "RoHS"],
      accessories: ["Télécommande", "Câble HDMI", "Support mural"],
      maintenanceNotes: "Nettoyage hebdomadaire avec chiffon microfibre. Vérification mensuelle des connexions.",
      createdAt: "2025-01-03T10:00:00Z",
      updatedAt: "2025-01-03T10:00:00Z",
    },
    {
      id: "2",
      name: "Borne Interactive Kiosque",
      model: "BK-32-HD",
      brand: "Racha Business Group",
      category: "borne-interactive",
      description: "Borne interactive robuste pour usage intensif en extérieur",
      specifications: [
        { name: "Taille écran", value: "32", unit: "pouces" },
        { name: "Résolution", value: "1920x1080", unit: "pixels" },
        { name: "Processeur", value: "Intel i5", unit: "" },
        { name: "RAM", value: "8", unit: "GB" },
        { name: "Stockage", value: "256", unit: "GB SSD" },
      ],
      dimensions: {
        length: "600",
        width: "400",
        height: "1800",
        weight: "85",
      },
      powerRequirements: {
        voltage: "220V",
        power: "300W",
        frequency: "50Hz",
      },
      connectivity: ["Ethernet", "WiFi", "4G", "USB"],
      operatingConditions: {
        temperature: "-10°C à 50°C",
        humidity: "5% à 95%",
      },
      warranty: "2 ans pièces et main d'œuvre",
      certifications: ["IP65", "CE", "FCC"],
      accessories: ["Clavier étanche", "Imprimante thermique", "Lecteur de cartes"],
      maintenanceNotes: "Maintenance trimestrielle recommandée. Vérification étanchéité semestrielle.",
      createdAt: "2025-01-02T14:30:00Z",
      updatedAt: "2025-01-02T14:30:00Z",
    },
  ]);

  const handleAddSheet = (sheetData: any) => {
    const newSheet = {
      ...sheetData,
      id: `TS-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTechnicalSheets([newSheet, ...technicalSheets]);
    toast.success("Fiche technique créée avec succès", {
      description: `La fiche technique "${sheetData.name}" a été créée`
    });
  };

  const handleUpdateSheet = (sheetData: any) => {
    const updatedSheets = technicalSheets.map(sheet =>
      sheet.id === sheetData.id ? sheetData : sheet
    );
    setTechnicalSheets(updatedSheets);
    setEditingSheet(null);
    toast.success("Fiche technique modifiée avec succès");
  };

  const handleEditSheet = (sheet: any) => {
    setEditingSheet(sheet);
    setOpenForm(true);
  };

  const handleViewDetails = (sheet: any) => {
    setViewingSheet(sheet);
    setOpenDetailsModal(true);
  };

  const handleDeleteSheet = (sheetId: string) => {
    setTechnicalSheets(technicalSheets.filter(sheet => sheet.id !== sheetId));
    toast.success("Fiche technique supprimée");
  };

  const handleGeneratePDF = (sheet: any) => {
    // Convertir les données de la fiche technique au format attendu
    const technicalData = {
      id: sheet.id,
      name: sheet.equipmentName || sheet.name,
      brand: sheet.brand,
      model: sheet.model,
      category: sheet.category,
      description: sheet.description,
      price: {
        sale: sheet.price || 0,
        rental: sheet.rentalPrice || 0
      },
      technicalSpecs: sheet.technicalSpecs,
      specifications: {
        dimensions: sheet.dimensions,
        weight: sheet.weight,
        power: sheet.power,
        connectivity: sheet.connectivity,
        display: sheet.display,
        processor: sheet.processor,
        memory: sheet.memory,
        storage: sheet.storage,
        os: sheet.os
      },
      features: sheet.features || [],
      maintenanceNotes: sheet.maintenanceNotes,
      warranty: sheet.warranty,
      availability: sheet.availability,
      sku: sheet.sku || sheet.reference
    };

    technicalSheetPDFService.generateTechnicalSheetPDF(technicalData);
  };

  const handleCloseForm = (open: boolean) => {
    setOpenForm(open);
    if (!open) {
      setEditingSheet(null);
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, { label: string; color: string }> = {
      "ecran-tactile": { label: "Écran tactile", color: "bg-blue-100 text-blue-800" },
      "borne-interactive": { label: "Borne interactive", color: "bg-green-100 text-green-800" },
      "projecteur": { label: "Projecteur", color: "bg-purple-100 text-purple-800" },
      "audio": { label: "Audio", color: "bg-orange-100 text-orange-800" },
      "eclairage": { label: "Éclairage", color: "bg-yellow-100 text-yellow-800" },
      "accessoire": { label: "Accessoire", color: "bg-gray-100 text-gray-800" },
    };

    const categoryInfo = categoryMap[category] || { label: category, color: "bg-gray-100 text-gray-800" };
    
    return (
      <Badge variant="outline" className={`${categoryInfo.color} hover:${categoryInfo.color}`}>
        {categoryInfo.label}
      </Badge>
    );
  };

  const filteredSheets = technicalSheets.filter(sheet =>
    sheet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sheet.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sheet.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Fiches Techniques">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fiches Techniques</h1>
          <p className="text-gray-600">Gérez les fiches techniques de vos équipements</p>
        </div>
        <Button className="gap-2 mt-4 md:mt-0" onClick={() => setOpenForm(true)}>
          <Plus size={16} />
          Nouvelle fiche technique
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher une fiche technique..."
            className="pl-8 bg-white border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSheets.map((sheet) => (
          <Card key={sheet.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{sheet.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {sheet.brand} - {sheet.model}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(sheet)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir détails
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditSheet(sheet)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleGeneratePDF(sheet)}>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteSheet(sheet.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getCategoryBadge(sheet.category)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {sheet.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Spécifications:</span>
                  <span className="font-medium">{sheet.specifications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Connectivité:</span>
                  <span className="font-medium">{sheet.connectivity.length} types</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Garantie:</span>
                  <span className="font-medium">{sheet.warranty}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-2"
                  onClick={() => handleGeneratePDF(sheet)}
                >
                  <FileText size={14} />
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                >
                  <Image size={14} />
                  Images
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSheets.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune fiche technique</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "Aucun résultat pour votre recherche." : "Commencez par créer votre première fiche technique."}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={() => setOpenForm(true)} className="gap-2">
                <Plus size={16} />
                Nouvelle fiche technique
              </Button>
            </div>
          )}
        </div>
      )}

      <TechnicalSheetForm
        open={openForm}
        onOpenChange={handleCloseForm}
        onSave={editingSheet ? handleUpdateSheet : handleAddSheet}
        editingSheet={editingSheet}
      />

      <TechnicalSheetDetails
        sheet={viewingSheet}
        open={openDetailsModal}
        onOpenChange={setOpenDetailsModal}
        onEdit={(sheet) => {
          setOpenDetailsModal(false);
          handleEditSheet(sheet);
        }}
        onGeneratePDF={handleGeneratePDF}
      />
    </Layout>
  );
}
