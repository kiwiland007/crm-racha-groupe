import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  CreditCard, 
  Mail, 
  MessageSquare, 
  UserPlus, 
  Key, 
  Globe,
  CheckCircle,
  AlertCircle,
  Copy
} from "lucide-react";

// Schémas de validation pour chaque intégration
const paymentSchema = z.object({
  provider: z.string().min(1, "Fournisseur requis"),
  apiKey: z.string().min(1, "Clé API requise"),
  secretKey: z.string().min(1, "Clé secrète requise"),
  webhookUrl: z.string().url("URL webhook invalide"),
  testMode: z.boolean().default(true),
  currency: z.string().default("MAD"),
});

const emailSchema = z.object({
  provider: z.string().min(1, "Fournisseur requis"),
  apiKey: z.string().min(1, "Clé API requise"),
  fromEmail: z.string().email("Email invalide"),
  fromName: z.string().min(1, "Nom expéditeur requis"),
  replyTo: z.string().email("Email de réponse invalide").optional(),
  webhookUrl: z.string().url("URL webhook invalide").optional(),
});

const chatSchema = z.object({
  provider: z.string().min(1, "Fournisseur requis"),
  widgetId: z.string().min(1, "ID widget requis"),
  apiKey: z.string().min(1, "Clé API requise"),
  autoStart: z.boolean().default(true),
  position: z.string().default("bottom-right"),
  primaryColor: z.string().default("#1a2b3c"),
});

const authSchema = z.object({
  provider: z.string().min(1, "Fournisseur requis"),
  clientId: z.string().min(1, "Client ID requis"),
  clientSecret: z.string().min(1, "Client Secret requis"),
  redirectUrl: z.string().url("URL de redirection invalide"),
  scopes: z.string().default("email,profile"),
  enabled: z.boolean().default(false),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;
type EmailFormValues = z.infer<typeof emailSchema>;
type ChatFormValues = z.infer<typeof chatSchema>;
type AuthFormValues = z.infer<typeof authSchema>;

interface IntegrationModalsProps {
  paymentOpen: boolean;
  emailOpen: boolean;
  chatOpen: boolean;
  authOpen: boolean;
  onPaymentOpenChange: (open: boolean) => void;
  onEmailOpenChange: (open: boolean) => void;
  onChatOpenChange: (open: boolean) => void;
  onAuthOpenChange: (open: boolean) => void;
}

export function IntegrationModals({
  paymentOpen,
  emailOpen,
  chatOpen,
  authOpen,
  onPaymentOpenChange,
  onEmailOpenChange,
  onChatOpenChange,
  onAuthOpenChange,
}: IntegrationModalsProps) {

  // Clés de stockage
  const STORAGE_KEYS = {
    payment: 'crm_integration_payment',
    email: 'crm_integration_email',
    chat: 'crm_integration_chat',
    auth: 'crm_integration_auth'
  };

  // Charger les données sauvegardées
  const loadSavedData = (key: string) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Erreur chargement intégration:', error);
      return null;
    }
  };

  // Sauvegarder les données
  const saveData = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur sauvegarde intégration:', error);
    }
  };

  // Forms
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      provider: "",
      apiKey: "",
      secretKey: "",
      webhookUrl: "",
      testMode: true,
      currency: "MAD",
    },
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      provider: "",
      apiKey: "",
      fromEmail: "",
      fromName: "",
      replyTo: "",
      webhookUrl: "",
    },
  });

  const chatForm = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      provider: "",
      widgetId: "",
      apiKey: "",
      autoStart: true,
      position: "bottom-right",
      primaryColor: "#1a2b3c",
    },
  });

  const authForm = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      provider: "",
      clientId: "",
      clientSecret: "",
      redirectUrl: "",
      scopes: "email,profile",
      enabled: false,
    },
  });

  // Charger les données au montage
  useEffect(() => {
    const paymentData = loadSavedData(STORAGE_KEYS.payment);
    if (paymentData) {
      paymentForm.reset(paymentData);
    }

    const emailData = loadSavedData(STORAGE_KEYS.email);
    if (emailData) {
      emailForm.reset(emailData);
    }

    const chatData = loadSavedData(STORAGE_KEYS.chat);
    if (chatData) {
      chatForm.reset(chatData);
    }

    const authData = loadSavedData(STORAGE_KEYS.auth);
    if (authData) {
      authForm.reset(authData);
    }
  }, []);

  // Handlers
  const handlePaymentSubmit = (data: PaymentFormValues) => {
    saveData(STORAGE_KEYS.payment, data);
    console.log("Configuration paiement:", data);
    toast.success("Configuration paiement sauvegardée", {
      description: `${data.provider} configuré avec succès`
    });
    onPaymentOpenChange(false);
  };

  const handleEmailSubmit = (data: EmailFormValues) => {
    saveData(STORAGE_KEYS.email, data);
    console.log("Configuration email:", data);
    toast.success("Configuration email sauvegardée", {
      description: `${data.provider} configuré avec succès`
    });
    onEmailOpenChange(false);
  };

  const handleChatSubmit = (data: ChatFormValues) => {
    saveData(STORAGE_KEYS.chat, data);
    console.log("Configuration chat:", data);
    toast.success("Configuration chat sauvegardée", {
      description: `${data.provider} configuré avec succès`
    });
    onChatOpenChange(false);
  };

  const handleAuthSubmit = (data: AuthFormValues) => {
    saveData(STORAGE_KEYS.auth, data);
    console.log("Configuration auth:", data);
    toast.success("Configuration authentification sauvegardée", {
      description: `${data.provider} configuré avec succès`
    });
    onAuthOpenChange(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié`, {
      description: "Collé dans le presse-papiers"
    });
  };

  return (
    <>
      {/* Modal Configuration Paiement */}
      <Dialog open={paymentOpen} onOpenChange={onPaymentOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Configuration Passerelle de Paiement
            </DialogTitle>
            <DialogDescription>
              Configurez votre passerelle de paiement pour traiter les transactions en ligne.
            </DialogDescription>
          </DialogHeader>
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
              <FormField
                control={paymentForm.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fournisseur de paiement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un fournisseur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="cmi">CMI (Maroc)</SelectItem>
                        <SelectItem value="maroc_telecommerce">Maroc Telecommerce</SelectItem>
                        <SelectItem value="payzone">PayZone</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={paymentForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clé API</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="pk_test_..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={paymentForm.control}
                  name="secretKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clé secrète</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="sk_test_..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={paymentForm.control}
                name="webhookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Webhook</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="https://votre-site.com/webhook/payment" {...field} />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(field.value, "URL Webhook")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      URL pour recevoir les notifications de paiement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={paymentForm.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devise</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MAD">MAD (Dirham Marocain)</SelectItem>
                          <SelectItem value="EUR">EUR (Euro)</SelectItem>
                          <SelectItem value="USD">USD (Dollar US)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={paymentForm.control}
                  name="testMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Mode test</FormLabel>
                        <FormDescription>
                          Activer le mode test pour les transactions
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onPaymentOpenChange(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Sauvegarder
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal Configuration Email Marketing */}
      <Dialog open={emailOpen} onOpenChange={onEmailOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Configuration Email Marketing
            </DialogTitle>
            <DialogDescription>
              Configurez votre service d'email marketing pour automatiser vos campagnes.
            </DialogDescription>
          </DialogHeader>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fournisseur d'email</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un fournisseur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mailchimp">Mailchimp</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="brevo">Brevo (ex-Sendinblue)</SelectItem>
                        <SelectItem value="resend">Resend</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={emailForm.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clé API</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Votre clé API..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={emailForm.control}
                  name="fromEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email expéditeur</FormLabel>
                      <FormControl>
                        <Input placeholder="noreply@votre-site.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={emailForm.control}
                  name="fromName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom expéditeur</FormLabel>
                      <FormControl>
                        <Input placeholder="Racha Business Group" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={emailForm.control}
                name="replyTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de réponse (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@votre-site.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onEmailOpenChange(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Sauvegarder
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal Configuration Chat Client */}
      <Dialog open={chatOpen} onOpenChange={onChatOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Configuration Chat Client
            </DialogTitle>
            <DialogDescription>
              Intégrez un service de chat client sur votre site web.
            </DialogDescription>
          </DialogHeader>
          <Form {...chatForm}>
            <form onSubmit={chatForm.handleSubmit(handleChatSubmit)} className="space-y-4">
              <FormField
                control={chatForm.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fournisseur de chat</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un fournisseur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="intercom">Intercom</SelectItem>
                        <SelectItem value="zendesk">Zendesk Chat</SelectItem>
                        <SelectItem value="crisp">Crisp</SelectItem>
                        <SelectItem value="tawk">Tawk.to</SelectItem>
                        <SelectItem value="freshchat">Freshchat</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={chatForm.control}
                  name="widgetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Widget</FormLabel>
                      <FormControl>
                        <Input placeholder="widget_id_123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={chatForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clé API</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Votre clé API..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={chatForm.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position du widget</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bottom-right">Bas droite</SelectItem>
                          <SelectItem value="bottom-left">Bas gauche</SelectItem>
                          <SelectItem value="top-right">Haut droite</SelectItem>
                          <SelectItem value="top-left">Haut gauche</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={chatForm.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur principale</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={chatForm.control}
                name="autoStart"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Démarrage automatique</FormLabel>
                      <FormDescription>
                        Ouvrir automatiquement le chat pour les nouveaux visiteurs
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onChatOpenChange(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Sauvegarder
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal Configuration Authentification */}
      <Dialog open={authOpen} onOpenChange={onAuthOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Configuration Authentification
            </DialogTitle>
            <DialogDescription>
              Configurez l'authentification OAuth pour vos utilisateurs.
            </DialogDescription>
          </DialogHeader>
          <Form {...authForm}>
            <form onSubmit={authForm.handleSubmit(handleAuthSubmit)} className="space-y-4">
              <FormField
                control={authForm.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fournisseur d'authentification</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un fournisseur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="google">Google OAuth</SelectItem>
                        <SelectItem value="facebook">Facebook Login</SelectItem>
                        <SelectItem value="microsoft">Microsoft Azure AD</SelectItem>
                        <SelectItem value="github">GitHub OAuth</SelectItem>
                        <SelectItem value="linkedin">LinkedIn OAuth</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={authForm.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre Client ID..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={authForm.control}
                  name="clientSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Secret</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Votre Client Secret..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={authForm.control}
                name="redirectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de redirection</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="https://votre-site.com/auth/callback" {...field} />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(field.value, "URL de redirection")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      URL où l'utilisateur sera redirigé après authentification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={authForm.control}
                name="scopes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scopes (permissions)</FormLabel>
                    <FormControl>
                      <Input placeholder="email,profile,openid" {...field} />
                    </FormControl>
                    <FormDescription>
                      Permissions demandées, séparées par des virgules
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={authForm.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Activer l'authentification</FormLabel>
                      <FormDescription>
                        Permettre aux utilisateurs de se connecter avec ce fournisseur
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onAuthOpenChange(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Sauvegarder
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
