import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { clearAllCache, clearCacheByKey } from "@/utils/cacheUtils";
import { Trash2 } from "lucide-react";

export const CacheManager: React.FC = () => {
  const handleClearAllCache = () => {
    if (clearAllCache()) {
      toast({
        title: "Cache vidé",
        description: "Toutes les données en cache ont été supprimées avec succès.",
        variant: "success"
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de vider le cache. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion du Cache</CardTitle>
        <CardDescription>
          Videz le cache de l'application pour résoudre les problèmes de données ou forcer un rechargement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Le vidage du cache supprimera toutes les données temporaires stockées localement. 
          Cette action ne peut pas être annulée.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          onClick={handleClearAllCache}
          className="gap-2"
        >
          <Trash2 size={16} />
          Vider le cache
        </Button>
      </CardFooter>
    </Card>
  );
};