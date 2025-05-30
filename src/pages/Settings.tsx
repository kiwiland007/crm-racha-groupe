
import { useState } from "react";
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
  Settings2,
  UserPlus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserManagement } from "@/components/settings/UserManagement";
import { LeadCaptureForm } from "@/components/marketing/LeadCaptureForm";
import { WhatsAppStats } from "@/components/whatsapp/WhatsAppIntegration";
import { IntegrationModals } from "@/components/settings/IntegrationModals";
import { APIManagement } from "@/components/settings/APIManagement";

export default function Settings() {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "TechTouch Maroc",
    email: "contact@techtouch.ma",
    phone: "0522 12 34 56",
    address: "52 Rue des Palmiers, Casablanca 20100, Maroc",
    website: "https://techtouch.ma",
    description: "Spécialiste des solutions d'écrans tactiles interactifs pour professionnels",
    logo: "",
    facebook: "https://facebook.com/techtouchmaroc",
    instagram: "https://instagram.com/techtouchmaroc",
    linkedin: "https://linkedin.com/company/techtouch-maroc",
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

  const handleGeneralSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Paramètres généraux enregistrés");
  };

  const handleNotificationSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Paramètres de notification enregistrés");
  };

  const handleWhatsAppReconfigure = () => {
    toast.info("Reconfiguration WhatsApp", {
      description: "Ouverture de l'assistant de reconfiguration WhatsApp Business"
    });
  };

  return (
    <Layout title="Paramètres">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6 md:w-auto md:grid-cols-6">
          <TabsTrigger value="general" className="flex gap-2 items-center">
            <Settings2 size={16} />
            <span className="hidden sm:inline">Général</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex gap-2 items-center">
            <Users size={16} />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 items-center">
            <BellRing size={16} />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex gap-2 items-center">
            <Globe size={16} />
            <span className="hidden sm:inline">Intégrations</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex gap-2 items-center">
            <CreditCard size={16} />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex gap-2 items-center">
            <MessageSquare size={16} />
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
        <TabsContent value="whatsapp">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Configuration WhatsApp Business
                </CardTitle>
                <CardDescription>
                  Gérez votre intégration WhatsApp Business pour communiquer avec vos clients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-md">
                        <MessageSquare className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">WhatsApp Business API</h3>
                        <p className="text-sm text-muted-foreground">
                          Statut de la connexion à l'API WhatsApp Business
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      ✓ Connecté
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-number">Numéro WhatsApp Business</Label>
                      <Input
                        id="whatsapp-number"
                        value="+212 661 234 567"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-name">Nom de l'entreprise</Label>
                      <Input
                        id="business-name"
                        value="Racha Business Digital SARL"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">URL Webhook</Label>
                    <Input
                      id="webhook-url"
                      value="https://api.rachabusinessgroup.com/webhook/whatsapp"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" onClick={handleWhatsAppReconfigure}>
                      Reconfigurer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <WhatsAppStats />
          </div>
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
    </Layout>
  );
}
