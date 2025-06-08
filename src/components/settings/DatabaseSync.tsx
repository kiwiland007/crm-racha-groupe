import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Database,
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Wifi,
  WifiOff,
  Server
} from "lucide-react";
import { toast } from "sonner";
import { databaseService } from "@/services/databaseService";

export function DatabaseSync() {
  const [isConnected, setIsConnected] = useState(false);
  const [syncStats, setSyncStats] = useState({
    queueSize: 0,
    lastSync: null as string | null,
    isOnline: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    checkConnection();
    updateSyncStats();
    
    // Vérifier la connexion toutes les 30 secondes
    const interval = setInterval(() => {
      checkConnection();
      updateSyncStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await databaseService.testConnection();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const updateSyncStats = () => {
    const stats = databaseService.getSyncStats();
    setSyncStats(stats);
  };

  const handleExportToDatabase = async () => {
    setIsLoading(true);
    setSyncProgress(0);
    
    try {
      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const success = await databaseService.exportLocalDataToDatabase();
      
      clearInterval(progressInterval);
      setSyncProgress(100);
      
      if (success) {
        toast.success("Export réussi", {
          description: "Toutes les données locales ont été exportées vers la base de données"
        });
        updateSyncStats();
      }
    } catch (error) {
      toast.error("Erreur d'export", {
        description: "Impossible d'exporter les données vers la base de données"
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setSyncProgress(0), 2000);
    }
  };

  const handleImportFromDatabase = async () => {
    setIsLoading(true);
    setSyncProgress(0);
    
    try {
      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const success = await databaseService.importDataFromDatabase();
      
      clearInterval(progressInterval);
      setSyncProgress(100);
      
      if (success) {
        toast.success("Import réussi", {
          description: "Toutes les données ont été importées depuis la base de données"
        });
        updateSyncStats();
        
        // Recharger la page pour mettre à jour l'interface
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      toast.error("Erreur d'import", {
        description: "Impossible d'importer les données depuis la base de données"
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setSyncProgress(0), 2000);
    }
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    
    try {
      // Forcer la synchronisation de la queue
      await databaseService.exportLocalDataToDatabase();
      updateSyncStats();
      
      toast.success("Synchronisation terminée", {
        description: "Toutes les données en attente ont été synchronisées"
      });
    } catch (error) {
      toast.error("Erreur de synchronisation", {
        description: "Impossible de synchroniser les données"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConnectionStatus = () => {
    if (!syncStats.isOnline) {
      return {
        icon: <WifiOff className="h-4 w-4" />,
        text: "Hors ligne",
        color: "bg-gray-100 text-gray-800"
      };
    }
    
    if (isConnected) {
      return {
        icon: <CheckCircle className="h-4 w-4" />,
        text: "Connecté",
        color: "bg-green-100 text-green-800"
      };
    }
    
    return {
      icon: <AlertCircle className="h-4 w-4" />,
      text: "Déconnecté",
      color: "bg-red-100 text-red-800"
    };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Synchronisation Base de Données
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statut de connexion */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5 text-gray-600" />
            <div>
              <h3 className="font-medium">Base de données MySQL</h3>
              <p className="text-sm text-gray-500">
                admin_crm@localhost:3306
              </p>
            </div>
          </div>
          <Badge className={connectionStatus.color}>
            {connectionStatus.icon}
            {connectionStatus.text}
          </Badge>
        </div>

        {/* Informations de synchronisation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Dernière sync</span>
            </div>
            <p className="text-sm text-gray-600">
              {syncStats.lastSync 
                ? new Date(syncStats.lastSync).toLocaleString('fr-FR')
                : 'Jamais'
              }
            </p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">En attente</span>
            </div>
            <p className="text-lg font-bold text-orange-600">
              {syncStats.queueSize}
            </p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              {syncStats.isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Connexion</span>
            </div>
            <p className={`text-sm font-medium ${
              syncStats.isOnline ? 'text-green-600' : 'text-red-600'
            }`}>
              {syncStats.isOnline ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
        </div>

        {/* Barre de progression */}
        {syncProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Synchronisation en cours...</span>
              <span>{syncProgress}%</span>
            </div>
            <Progress value={syncProgress} className="h-2" />
          </div>
        )}

        {/* Alertes */}
        {!isConnected && syncStats.isOnline && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Impossible de se connecter à la base de données. Vérifiez la configuration réseau.
            </AlertDescription>
          </Alert>
        )}

        {syncStats.queueSize > 0 && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              {syncStats.queueSize} élément(s) en attente de synchronisation. 
              {isConnected ? ' Cliquez sur "Synchroniser" pour les traiter.' : ' Connexion requise.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Actions de synchronisation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={handleExportToDatabase}
            disabled={!isConnected || isLoading}
            className="gap-2"
            variant="outline"
          >
            <Upload className="h-4 w-4" />
            Exporter vers DB
          </Button>
          
          <Button
            onClick={handleImportFromDatabase}
            disabled={!isConnected || isLoading}
            className="gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Importer depuis DB
          </Button>
          
          <Button
            onClick={handleManualSync}
            disabled={!isConnected || isLoading || syncStats.queueSize === 0}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Synchroniser
          </Button>
        </div>

        {/* Informations techniques */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Les données sont automatiquement sauvegardées localement</p>
          <p>• La synchronisation se fait automatiquement quand une connexion est disponible</p>
          <p>• Utilisez "Exporter" pour sauvegarder toutes les données locales vers la base</p>
          <p>• Utilisez "Importer" pour récupérer les données depuis la base de données</p>
        </div>
      </CardContent>
    </Card>
  );
}
