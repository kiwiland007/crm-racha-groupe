import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  BellRing,
  Building,
  CreditCard,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageSquare,
  Save,
  Settings,
  Settings2,
  UserPlus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserManagement } from "@/components/settings/UserManagement";
import { LeadCaptureForm } from "@/components/marketing/LeadCaptureForm";
import { WhatsAppStats } from "@/components/whatsapp/WhatsAppIntegration";
import { WhatsAppConfigWizard } from "@/components/whatsapp/WhatsAppConfigWizard";
import { IntegrationModals } from "@/components/settings/IntegrationModals";
import { APIManagement } from "@/components/settings/APIManagement";


export default function Settings() {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Racha Business Group",
    email: "contact@rachabusinessgroup.ma",
    phone: "0522 12 34 56",
    address: "52 Rue des Palmiers, Casablanca 20100, Maroc",
    website: "https://rachabusinessgroup.ma",
    description: "Spécialiste des solutions d'écrans tactiles interactifs pour professionnels",
    logo: "",
    facebook: "https://facebook.com/rachabusinessgroup",
    instagram: "https://instagram.com/rachabusinessgroup",
    linkedin: "https://linkedin.com/company/racha-business-group",
    // Informations légales marocaines
    rc: "123456",
    if: "56789012",
    ice: "002345678901234",
    patente: "78901234",
    cnss: "9876543",
    capital: "100000.00",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newLeadAlerts: true,
    quotationAlerts: true,
    eventReminders: true,
    paymentAlerts: true,
  });

  const [openLeadCaptureForm, setOpenLeadCaptureForm] = useState(false);

  // États pour les modals d'intégration
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [whatsappWizardOpen, setWhatsappWizardOpen] = useState(false);

  // Charger les paramètres depuis localStorage au démarrage
  useEffect(() => {
    const savedSettings = localStorage.getItem('crm_company_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setGeneralSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    }
  }, []);

  const handleGeneralSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Sauvegarder dans localStorage
    localStorage.setItem('crm_company_settings', JSON.stringify(generalSettings));
    toast.success("Paramètres généraux enregistrés", {
      description: "Les informations de l'entreprise ont été sauvegardées avec succès"
    });
  };

  const handleNotificationSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Paramètres de notification enregistrés");
  };

  const handleWhatsAppReconfigure = () => {
    setWhatsappWizardOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres de votre CRM et configurez vos intégrations.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:w-auto lg:grid-cols-6">
          <TabsTrigger value="general" className="flex gap-1 md:gap-2 items-center text-xs md:text-sm">
            <Settings2 size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Général</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex gap-1 md:gap-2 items-center text-xs md:text-sm">
            <Users size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-1 md:gap-2 items-center text-xs md:text-sm">
            <BellRing size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex gap-1 md:gap-2 items-center text-xs md:text-sm">
            <Globe size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Intégrations</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex gap-1 md:gap-2 items-center text-xs md:text-sm">
            <CreditCard size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex gap-1 md:gap-2 items-center text-xs md:text-sm">
            <MessageSquare size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </TabsTrigger>
        </TabsList>

        {/* Paramètres Généraux */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>
                Gérez les informations de votre entreprise et de votre marque.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneralSettingsSave}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Nom de l'entreprise</Label>
                    <Input
                      id="companyName"
                      value={generalSettings.companyName}
                      onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={generalSettings.email}
                        onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={generalSettings.phone}
                        onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea
                      id="address"
                      value={generalSettings.address}
                      onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      value={generalSettings.website}
                      onChange={(e) => setGeneralSettings({...generalSettings, website: e.target.value})}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description de l'entreprise</Label>
                    <Textarea
                      id="description"
                      value={generalSettings.description}
                      onChange={(e) => setGeneralSettings({...generalSettings, description: e.target.value})}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <h3 className="text-lg font-medium mb-4">Informations légales (Maroc)</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="rc">RC (Registre de Commerce)</Label>
                      <Input
                        id="rc"
                        placeholder="123456"
                        value={generalSettings.rc}
                        onChange={(e) => setGeneralSettings({...generalSettings, rc: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="if">IF (Identifiant Fiscal)</Label>
                      <Input
                        id="if"
                        placeholder="56789012"
                        value={generalSettings.if}
                        onChange={(e) => setGeneralSettings({...generalSettings, if: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ice">ICE (Identifiant Commun de l'Entreprise)</Label>
                      <Input
                        id="ice"
                        placeholder="002345678901234"
                        value={generalSettings.ice}
                        onChange={(e) => setGeneralSettings({...generalSettings, ice: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="patente">Patente</Label>
                      <Input
                        id="patente"
                        placeholder="78901234"
                        value={generalSettings.patente}
                        onChange={(e) => setGeneralSettings({...generalSettings, patente: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cnss">CNSS</Label>
                      <Input
                        id="cnss"
                        placeholder="9876543"
                        value={generalSettings.cnss}
                        onChange={(e) => setGeneralSettings({...generalSettings, cnss: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="capital">Capital (MAD)</Label>
                      <Input
                        id="capital"
                        placeholder="100000.00"
                        value={generalSettings.capital}
                        onChange={(e) => setGeneralSettings({...generalSettings, capital: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <h3 className="text-lg font-medium mb-4">Réseaux sociaux</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="facebook" className="flex items-center gap-2">
                        <Facebook size={16} /> Facebook
                      </Label>
                      <Input
                        id="facebook"
                        value={generalSettings.facebook}
                        onChange={(e) => setGeneralSettings({...generalSettings, facebook: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram size={16} /> Instagram
                      </Label>
                      <Input
                        id="instagram"
                        value={generalSettings.instagram}
                        onChange={(e) => setGeneralSettings({...generalSettings, instagram: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin size={16} /> LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={generalSettings.linkedin}
                      onChange={(e) => setGeneralSettings({...generalSettings, linkedin: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button type="submit" className="gap-2">
                    <Save size={16} />
                    Enregistrer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des Utilisateurs */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>
                Ajoutez, modifiez ou supprimez des utilisateurs et gérez leurs permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres de Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notifications</CardTitle>
              <CardDescription>
                Configurez les notifications pour vous et votre équipe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSettingsSave}>
                <div className="grid gap-6">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                      <span>Notifications par email</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        Recevoir des notifications par email
                      </span>
                    </Label>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({...notificationSettings, emailNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="smsNotifications" className="flex flex-col space-y-1">
                      <span>Notifications par SMS</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        Recevoir des notifications par SMS
                      </span>
                    </Label>
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({...notificationSettings, smsNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="pushNotifications" className="flex flex-col space-y-1">
                      <span>Notifications push</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        Recevoir des notifications push dans l'application
                      </span>
                    </Label>
                    <Switch
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({...notificationSettings, pushNotifications: checked})
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Types de notifications</h3>

                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="newLeadAlerts">Nouveaux leads</Label>
                      <Switch
                        id="newLeadAlerts"
                        checked={notificationSettings.newLeadAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({...notificationSettings, newLeadAlerts: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="quotationAlerts">Devis et factures</Label>
                      <Switch
                        id="quotationAlerts"
                        checked={notificationSettings.quotationAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({...notificationSettings, quotationAlerts: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="eventReminders">Rappels d'événements</Label>
                      <Switch
                        id="eventReminders"
                        checked={notificationSettings.eventReminders}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({...notificationSettings, eventReminders: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="paymentAlerts">Paiements</Label>
                      <Switch
                        id="paymentAlerts"
                        checked={notificationSettings.paymentAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({...notificationSettings, paymentAlerts: checked})
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button type="submit" className="gap-2">
                    <Save size={16} />
                    Enregistrer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Intégrations */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations et API</CardTitle>
              <CardDescription>
                Connectez des services externes et configurez les API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-md">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Passerelle de Paiement</h3>
                        <p className="text-sm text-muted-foreground">
                          Connectez votre passerelle de paiement pour traiter les paiements en ligne
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPaymentModalOpen(true)}
                    >
                      Configurer
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-md">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Service d'Email Marketing</h3>
                        <p className="text-sm text-muted-foreground">
                          Connectez votre service d'email marketing pour automatiser les campagnes
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setEmailModalOpen(true)}
                    >
                      Configurer
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-md">
                        <MessageSquare className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">WhatsApp Business</h3>
                        <p className="text-sm text-muted-foreground">
                          Communiquez directement avec vos clients via WhatsApp Business
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleWhatsAppReconfigure}
                      className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      Reconfigurer
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-md">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Service de Chat Client</h3>
                        <p className="text-sm text-muted-foreground">
                          Intégrez un service de chat client sur votre site web
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setChatModalOpen(true)}
                    >
                      Configurer
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-md">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">CRM et Gestion de Leads</h3>
                        <p className="text-sm text-muted-foreground">
                          Connectez-vous aux réseaux sociaux pour importer des leads
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setOpenLeadCaptureForm(true)}
                      className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      Configurer
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-md">
                        <UserPlus className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Authentification</h3>
                        <p className="text-sm text-muted-foreground">
                          Configurez l'authentification pour vos utilisateurs
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setAuthModalOpen(true)}
                    >
                      Configurer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion API */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des API</CardTitle>
              <CardDescription>
                Gérez vos clés API et accédez à la documentation technique.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <APIManagement />
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Business */}
        <TabsContent value="whatsapp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-green-600" />
                Configuration WhatsApp Business
              </CardTitle>
              <CardDescription>
                Gérez votre intégration WhatsApp Business pour communiquer avec vos clients.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Statut de connexion */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-md">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-900">WhatsApp Business API</h3>
                    <p className="text-sm text-green-700">
                      Connexion active et opérationnelle
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 w-fit">
                  ✓ Connecté
                </Badge>
              </div>

              {/* Informations de configuration */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-number" className="text-sm font-medium">
                      Numéro WhatsApp Business
                    </Label>
                    <Input
                      id="whatsapp-number"
                      value="+212 661 234 567"
                      disabled
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-name" className="text-sm font-medium">
                      Nom de l'entreprise
                    </Label>
                    <Input
                      id="business-name"
                      value="Racha Business Group"
                      disabled
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-url" className="text-sm font-medium">
                    URL Webhook
                  </Label>
                  <Input
                    id="webhook-url"
                    value="https://api.rachabusinessgroup.com/webhook/whatsapp"
                    disabled
                    className="bg-gray-50 border-gray-200 text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Cette URL reçoit les messages WhatsApp en temps réel
                  </p>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <h4 className="font-medium">Reconfiguration</h4>
                  <p className="text-sm text-muted-foreground">
                    Utilisez l'assistant pour modifier votre configuration WhatsApp
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleWhatsAppReconfigure}
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 whitespace-nowrap"
                >
                  <Settings size={16} className="mr-2" />
                  Assistant de reconfiguration
                </Button>
              </div>
            </CardContent>
          </Card>

          <WhatsAppStats />
        </TabsContent>
      </Tabs>

      <LeadCaptureForm
        open={openLeadCaptureForm}
        onOpenChange={setOpenLeadCaptureForm}
      />

      <IntegrationModals
        paymentOpen={paymentModalOpen}
        emailOpen={emailModalOpen}
        chatOpen={chatModalOpen}
        authOpen={authModalOpen}
        onPaymentOpenChange={setPaymentModalOpen}
        onEmailOpenChange={setEmailModalOpen}
        onChatOpenChange={setChatModalOpen}
        onAuthOpenChange={setAuthModalOpen}
      />

      <WhatsAppConfigWizard
        open={whatsappWizardOpen}
        onOpenChange={setWhatsappWizardOpen}
      />
      </div>
    </Layout>
  );
}
