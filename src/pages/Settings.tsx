
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Settings() {
  const [companySettings, setCompanySettings] = useState({
    name: "Maroc Tactile",
    website: "https://maroctactile.com",
    email: "contact@maroctactile.com",
    phone: "+212 522 123 456",
    language: "fr",
    timezone: "africa-casablanca",
    currency: "mad",
    dateFormat: "dd-mm-yyyy"
  });
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(0);
  
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Ahmed Dupont",
      email: "ahmed@maroctactile.com",
      role: "Admin",
      avatar: "AD"
    },
    {
      id: 2,
      name: "Sofia Moussaoui",
      email: "sofia@maroctactile.com",
      role: "Commercial",
      avatar: "SM"
    },
    {
      id: 3,
      name: "Karim Bennani",
      email: "karim@maroctactile.com",
      role: "Technicien",
      avatar: "KB"
    }
  ]);
  
  const [notificationSettings, setNotificationSettings] = useState({
    newProspects: true,
    stockAlerts: true,
    upcomingEvents: true,
    equipmentReturns: true,
    email: true,
    sms: false,
    browser: true,
    mobile: true
  });
  
  const [integrations, setIntegrations] = useState({
    facebook: false,
    instagram: false,
    linkedin: false,
    googleAds: false,
    mailchimp: false
  });

  const handleSave = () => {
    toast.success("Paramètres enregistrés", {
      description: "Vos modifications ont été enregistrées avec succès."
    });
  };
  
  const handleInputChange = (field, value) => {
    setCompanySettings({
      ...companySettings,
      [field]: value
    });
  };
  
  const handleNotificationToggle = (field) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: !notificationSettings[field]
    });
  };
  
  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success("Utilisateur supprimé", {
      description: "L'utilisateur a été supprimé avec succès."
    });
    setDeleteUserDialogOpen(false);
  };
  
  const confirmDeleteUser = (userId) => {
    setCurrentUserId(userId);
    setDeleteUserDialogOpen(true);
  };
  
  const handleIntegrationConnect = (platform) => {
    setIntegrations({
      ...integrations,
      [platform]: true
    });
    
    toast.success(`Connexion établie`, {
      description: `Votre compte ${platform} a été connecté avec succès.`
    });
  };
  
  const getRoleBadgeClass = (role) => {
    switch(role) {
      case "Admin":
        return "bg-racha-teal/10 text-racha-teal hover:bg-racha-teal/10";
      case "Commercial":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Technicien":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Layout title="Paramètres">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none h-auto">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>
                  Configurez les paramètres généraux de votre CRM.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informations de l'entreprise</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nom de l'entreprise</Label>
                      <Input 
                        id="company-name" 
                        value={companySettings.name}
                        onChange={(e) => handleInputChange('name', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Site web</Label>
                      <Input 
                        id="website" 
                        value={companySettings.website}
                        onChange={(e) => handleInputChange('website', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={companySettings.email}
                        onChange={(e) => handleInputChange('email', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input 
                        id="phone" 
                        value={companySettings.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Préférences régionales</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Langue par défaut</Label>
                      <Select 
                        value={companySettings.language}
                        onValueChange={(value) => handleInputChange('language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une langue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">Anglais</SelectItem>
                          <SelectItem value="ar">Arabe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuseau horaire</Label>
                      <Select 
                        value={companySettings.timezone}
                        onValueChange={(value) => handleInputChange('timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un fuseau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="africa-casablanca">Casablanca (UTC+1)</SelectItem>
                          <SelectItem value="europe-paris">Paris (UTC+1/+2)</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Devise</Label>
                      <Select 
                        value={companySettings.currency}
                        onValueChange={(value) => handleInputChange('currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une devise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mad">Dirham marocain (MAD)</SelectItem>
                          <SelectItem value="eur">Euro (EUR)</SelectItem>
                          <SelectItem value="usd">Dollar américain (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Format de date</Label>
                      <Select 
                        value={companySettings.dateFormat}
                        onValueChange={(value) => handleInputChange('dateFormat', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave}>Enregistrer les modifications</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Gérez les utilisateurs et leurs permissions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-end">
                  <Button onClick={() => setConfirmDialogOpen(true)}>Ajouter un utilisateur</Button>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Utilisateurs</h3>
                  <div className="space-y-4">
                    {users.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-racha-teal text-white">{user.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getRoleBadgeClass(user.role)}>
                            {user.role}
                          </Badge>
                          <Button variant="outline" size="sm">Éditer</Button>
                          <Button variant="outline" size="sm" className="text-red-600" onClick={() => confirmDeleteUser(user.id)}>
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Rôles et permissions</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Administrateur</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Accès complet au système</li>
                          <li>• Configuration des paramètres</li>
                          <li>• Gestion des utilisateurs</li>
                          <li>• Toutes les permissions</li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Commercial</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Gestion des contacts</li>
                          <li>• Ventes et devis</li>
                          <li>• Suivi des projets clients</li>
                          <li>• Rapports limités</li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Technicien</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Gestion du stock</li>
                          <li>• Planification des évènements</li>
                          <li>• Rapports techniques</li>
                          <li>• Support client limité</li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de notifications</CardTitle>
                <CardDescription>
                  Configurez quand et comment vous recevez des notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications du système</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Nouveaux prospects</p>
                        <p className="text-sm text-muted-foreground">Recevez des notifications quand de nouveaux prospects sont ajoutés</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.newProspects} 
                        onCheckedChange={() => handleNotificationToggle('newProspects')} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Alertes de stock</p>
                        <p className="text-sm text-muted-foreground">Recevez des alertes quand le stock est bas</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.stockAlerts} 
                        onCheckedChange={() => handleNotificationToggle('stockAlerts')} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Évènements à venir</p>
                        <p className="text-sm text-muted-foreground">Recevez des rappels pour les évènements planifiés</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.upcomingEvents} 
                        onCheckedChange={() => handleNotificationToggle('upcomingEvents')} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Retours d'équipement</p>
                        <p className="text-sm text-muted-foreground">Recevez des notifications pour les retours de location</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.equipmentReturns} 
                        onCheckedChange={() => handleNotificationToggle('equipmentReturns')} 
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Canaux de notification</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">Recevez des notifications par email</div>
                        <Switch 
                          checked={notificationSettings.email} 
                          onCheckedChange={() => handleNotificationToggle('email')} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>SMS</Label>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">Recevez des notifications par SMS</div>
                        <Switch 
                          checked={notificationSettings.sms} 
                          onCheckedChange={() => handleNotificationToggle('sms')} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Navigateur</Label>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">Recevez des notifications dans le navigateur</div>
                        <Switch 
                          checked={notificationSettings.browser} 
                          onCheckedChange={() => handleNotificationToggle('browser')} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Application mobile</Label>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">Recevez des notifications push sur mobile</div>
                        <Switch 
                          checked={notificationSettings.mobile} 
                          onCheckedChange={() => handleNotificationToggle('mobile')} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave}>Enregistrer les préférences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Intégrations</CardTitle>
                <CardDescription>
                  Connectez votre CRM à d'autres plateformes et services.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Réseaux sociaux</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-500 text-white p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </div>
                        <div>
                          <p className="font-medium">Facebook</p>
                          <p className="text-sm text-muted-foreground">Import des leads et partage de contenu</p>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant="outline"
                          onClick={() => handleIntegrationConnect('facebook')}
                          disabled={integrations.facebook}
                        >
                          {integrations.facebook ? 'Connecté' : 'Connecter'}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-pink-600 text-white p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </div>
                        <div>
                          <p className="font-medium">Instagram</p>
                          <p className="text-sm text-muted-foreground">Import des leads et partage de contenu</p>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant="outline"
                          onClick={() => handleIntegrationConnect('instagram')}
                          disabled={integrations.instagram}
                        >
                          {integrations.instagram ? 'Connecté' : 'Connecter'}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-600 text-white p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </div>
                        <div>
                          <p className="font-medium">LinkedIn</p>
                          <p className="text-sm text-muted-foreground">Import des leads et partage de contenu</p>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant="outline"
                          onClick={() => handleIntegrationConnect('linkedin')}
                          disabled={integrations.linkedin}
                        >
                          {integrations.linkedin ? 'Connecté' : 'Connecter'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Outils marketing</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-red-500 text-white p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                        </div>
                        <div>
                          <p className="font-medium">Google Ads</p>
                          <p className="text-sm text-muted-foreground">Import des leads et suivi de campagnes</p>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant="outline"
                          onClick={() => handleIntegrationConnect('googleAds')}
                          disabled={integrations.googleAds}
                        >
                          {integrations.googleAds ? 'Connecté' : 'Connecter'}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-500 text-white p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
                        </div>
                        <div>
                          <p className="font-medium">Mailchimp</p>
                          <p className="text-sm text-muted-foreground">Email marketing et automatisation</p>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant="outline"
                          onClick={() => handleIntegrationConnect('mailchimp')}
                          disabled={integrations.mailchimp}
                        >
                          {integrations.mailchimp ? 'Connecté' : 'Connecter'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
      {/* Boîte de dialogue pour confirmer la suppression d'un utilisateur */}
      <AlertDialog open={deleteUserDialogOpen} onOpenChange={setDeleteUserDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'utilisateur ne pourra plus accéder au système.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteUser(currentUserId)} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Boîte de dialogue pour ajouter un utilisateur */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ajouter un utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              La fonctionnalité d'ajout d'utilisateur sera disponible prochainement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Fermer</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
