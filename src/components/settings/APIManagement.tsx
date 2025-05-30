import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  MoreVertical, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: string;
  status: "active" | "inactive" | "expired";
  createdAt: string;
}

export function APIManagement() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "1",
      name: "Production API",
      key: "rk_live_1234567890abcdef",
      permissions: ["read", "write", "admin"],
      lastUsed: "Il y a 2 heures",
      status: "active",
      createdAt: "15/12/2024"
    },
    {
      id: "2", 
      name: "Mobile App API",
      key: "rk_live_abcdef1234567890",
      permissions: ["read", "write"],
      lastUsed: "Il y a 1 jour",
      status: "active",
      createdAt: "10/12/2024"
    },
    {
      id: "3",
      name: "Test API",
      key: "rk_test_9876543210fedcba",
      permissions: ["read"],
      lastUsed: "Il y a 1 semaine",
      status: "inactive",
      createdAt: "01/12/2024"
    }
  ]);

  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const [newKeyName, setNewKeyName] = useState("");

  const generateAPIKey = () => {
    const prefix = "rk_live_";
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = prefix;
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateAPIKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Nom requis", {
        description: "Veuillez entrer un nom pour la clé API"
      });
      return;
    }

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName.trim(),
      key: generateAPIKey(),
      permissions: ["read", "write"],
      lastUsed: "Jamais utilisée",
      status: "active",
      createdAt: new Date().toLocaleDateString('fr-FR')
    };

    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName("");
    
    toast.success("Clé API créée", {
      description: `Nouvelle clé API "${newKey.name}" générée avec succès`,
      action: {
        label: "Copier",
        onClick: () => copyToClipboard(newKey.key, "Clé API")
      }
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiée`, {
      description: "Collée dans le presse-papiers"
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handleDeleteKey = (keyId: string) => {
    const keyToDelete = apiKeys.find(k => k.id === keyId);
    setApiKeys(apiKeys.filter(k => k.id !== keyId));
    
    toast.success("Clé API supprimée", {
      description: `Clé "${keyToDelete?.name}" supprimée avec succès`
    });
  };

  const handleRegenerateKey = (keyId: string) => {
    const updatedKeys = apiKeys.map(key => {
      if (key.id === keyId) {
        return {
          ...key,
          key: generateAPIKey(),
          lastUsed: "Jamais utilisée"
        };
      }
      return key;
    });
    
    setApiKeys(updatedKeys);
    const updatedKey = updatedKeys.find(k => k.id === keyId);
    
    toast.success("Clé API régénérée", {
      description: `Nouvelle clé générée pour "${updatedKey?.name}"`,
      action: {
        label: "Copier",
        onClick: () => copyToClipboard(updatedKey?.key || "", "Nouvelle clé")
      }
    });
  };

  const getStatusBadge = (status: APIKey["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle size={12} className="mr-1" />
            Actif
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <AlertCircle size={12} className="mr-1" />
            Inactif
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle size={12} className="mr-1" />
            Expiré
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const maskKey = (key: string) => {
    const prefix = key.substring(0, 8);
    const suffix = key.substring(key.length - 4);
    return `${prefix}${"*".repeat(key.length - 12)}${suffix}`;
  };

  return (
    <div className="space-y-6">
      {/* Création nouvelle clé API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Créer une nouvelle clé API
          </CardTitle>
          <CardDescription>
            Générez une nouvelle clé API pour accéder à vos services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="keyName">Nom de la clé</Label>
              <Input
                id="keyName"
                placeholder="Ex: Production API, Mobile App..."
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateAPIKey()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreateAPIKey} className="gap-2">
                <Plus size={16} />
                Créer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des clés API */}
      <Card>
        <CardHeader>
          <CardTitle>Clés API existantes</CardTitle>
          <CardDescription>
            Gérez vos clés API existantes et leurs permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Clé API</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière utilisation</TableHead>
                  <TableHead>Créée le</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="h-6 w-6"
                        >
                          {showKeys[apiKey.id] ? (
                            <EyeOff size={12} />
                          ) : (
                            <Eye size={12} />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(apiKey.key, "Clé API")}
                          className="h-6 w-6"
                        >
                          <Copy size={12} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(apiKey.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {apiKey.lastUsed}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {apiKey.createdAt}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => copyToClipboard(apiKey.key, "Clé API")}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copier la clé
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRegenerateKey(apiKey.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Régénérer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleDeleteKey(apiKey.id)}
                          >
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

      {/* Documentation API */}
      <Card>
        <CardHeader>
          <CardTitle>Documentation API</CardTitle>
          <CardDescription>
            Informations pour utiliser l'API dans vos applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">URL de base</Label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm bg-gray-100 px-3 py-2 rounded flex-1">
                  https://api.rachabusinessgroup.com/v1
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard("https://api.rachabusinessgroup.com/v1", "URL de base")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Authentification</Label>
              <div className="mt-1">
                <code className="text-sm bg-gray-100 px-3 py-2 rounded block">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                📖 Documentation complète
              </Button>
              <Button variant="outline" className="gap-2">
                🧪 Tester l'API
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
