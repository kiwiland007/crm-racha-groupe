import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Search, 
  Check, 
  Trash2, 
  User, 
  Calendar, 
  Package, 
  AlertTriangle,
  Mail,
  Phone,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'prospect' | 'event' | 'stock' | 'invoice' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

const Notifications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "prospect",
      title: "Nouveau prospect",
      message: "John Doe a été ajouté via Facebook Ads",
      timestamp: "Il y a 10 minutes",
      read: false,
      priority: "high",
      actionUrl: "/contacts"
    },
    {
      id: "2",
      type: "event",
      title: "Évènement demain",
      message: "Salon Digital Tech à Casablanca",
      timestamp: "Il y a 1 heure",
      read: false,
      priority: "medium",
      actionUrl: "/events"
    },
    {
      id: "3",
      type: "stock",
      title: "Stock faible",
      message: "Écran tactile 32\" - 2 articles restants",
      timestamp: "Il y a 3 heures",
      read: false,
      priority: "high",
      actionUrl: "/inventory"
    },
    {
      id: "4",
      type: "invoice",
      title: "Facture en retard",
      message: "Facture INV-001 - Société ABC (15 000 MAD)",
      timestamp: "Il y a 1 jour",
      read: true,
      priority: "medium",
      actionUrl: "/invoices"
    },
    {
      id: "5",
      type: "system",
      title: "Sauvegarde terminée",
      message: "Sauvegarde automatique des données effectuée avec succès",
      timestamp: "Il y a 2 jours",
      read: true,
      priority: "low"
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'prospect':
        return <User className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'stock':
        return <Package className="h-4 w-4" />;
      case 'invoice':
        return <Mail className="h-4 w-4" />;
      case 'system':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "unread" && !notification.read) ||
                         (filter === "read" && notification.read) ||
                         notification.type === filter;
    
    return matchesSearch && matchesFilter;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    toast.success("Notification marquée comme lue");
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast.success("Toutes les notifications marquées comme lues");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success("Notification supprimée");
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout title="Notifications">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Gérez vos notifications et alertes système
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} non lues
                </Badge>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher des notifications..."
                className="pl-8 w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={markAllAsRead} variant="outline">
              <Check className="mr-2 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
            <TabsTrigger value="read">Lues</TabsTrigger>
            <TabsTrigger value="prospect">Prospects</TabsTrigger>
            <TabsTrigger value="event">Événements</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="invoice">Factures</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune notification
                    </h3>
                    <p className="text-gray-500 text-center">
                      {searchTerm ? 
                        `Aucune notification trouvée pour "${searchTerm}"` :
                        "Vous n'avez aucune notification pour le moment."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Clock className="h-3 w-3" />
                              {notification.timestamp}
                              <Badge variant="outline" className="text-xs">
                                {notification.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Notifications;
