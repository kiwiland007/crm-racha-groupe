
import { useState } from "react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const formSchema = z.object({
  apiKey: z.string().min(1, { message: "Clé API requise" }),
  accountId: z.string().min(1, { message: "ID de compte requis" }),
  campaignName: z.string().optional(),
  webhookUrl: z.string().url({ message: "URL de webhook invalide" }).optional().or(z.literal('')),
});

type SocialConnectFormValues = z.infer<typeof formSchema>;

export function LeadCaptureForm({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("facebook");
  const [connected, setConnected] = useState({
    facebook: false,
    instagram: false,
    linkedin: false
  });

  const form = useForm<SocialConnectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      accountId: "",
      campaignName: "",
      webhookUrl: "",
    },
  });

  function onSubmit(data: SocialConnectFormValues) {
    setIsSubmitting(true);
    
    try {
      // Simule une connexion à l'API des réseaux sociaux
      setTimeout(() => {
        // Marque ce réseau comme connecté
        setConnected({
          ...connected,
          [activeTab]: true
        });
        
        toast.success(`Compte ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} connecté`, {
          description: "Vous pourrez maintenant recevoir des leads depuis cette plateforme."
        });
        
        form.reset();
        
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      toast.error(`Erreur de connexion à ${activeTab}`, {
        description: "Veuillez vérifier vos identifiants et réessayer."
      });
      console.error("Erreur de connexion:", error);
      setIsSubmitting(false);
    }
  }

  const disconnectAccount = (platform: string) => {
    setConnected({
      ...connected,
      [platform]: false
    });
    
    toast.success(`Compte ${platform.charAt(0).toUpperCase() + platform.slice(1)} déconnecté`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Intégration marketing et leads</DialogTitle>
          <DialogDescription>
            Connectez vos comptes de réseaux sociaux pour importer automatiquement les leads.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="facebook" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="facebook" className="flex items-center gap-2">
              <Facebook size={16} /> Facebook
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center gap-2">
              <Instagram size={16} /> Instagram
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-2">
              <Linkedin size={16} /> LinkedIn
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="facebook">
            {connected.facebook ? (
              <div className="py-6 space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="text-green-800 font-medium flex items-center gap-2">
                    <Facebook size={16} /> Compte Facebook connecté
                  </h3>
                  <p className="text-green-700 text-sm mt-1">Les nouveaux leads seront automatiquement importés.</p>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" className="text-red-600" onClick={() => disconnectAccount('facebook')}>
                    Déconnecter
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clé API Facebook</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Entrez votre clé API" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID du compte publicitaire</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: act_123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="campaignName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la campagne (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Campagne Printemps 2025" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de Webhook (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                      {isSubmitting ? "Connexion..." : "Connecter le compte Facebook"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </TabsContent>
          
          <TabsContent value="instagram">
            {connected.instagram ? (
              <div className="py-6 space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="text-green-800 font-medium flex items-center gap-2">
                    <Instagram size={16} /> Compte Instagram connecté
                  </h3>
                  <p className="text-green-700 text-sm mt-1">Les nouveaux leads seront automatiquement importés.</p>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" className="text-red-600" onClick={() => disconnectAccount('instagram')}>
                    Déconnecter
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jeton d'accès Instagram</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Entrez votre jeton d'accès" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID du compte Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 12345678901234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="campaignName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la campagne (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Promotion Été 2025" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                      {isSubmitting ? "Connexion..." : "Connecter le compte Instagram"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </TabsContent>
          
          <TabsContent value="linkedin">
            {connected.linkedin ? (
              <div className="py-6 space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="text-green-800 font-medium flex items-center gap-2">
                    <Linkedin size={16} /> Compte LinkedIn connecté
                  </h3>
                  <p className="text-green-700 text-sm mt-1">Les nouveaux leads seront automatiquement importés.</p>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" className="text-red-600" onClick={() => disconnectAccount('linkedin')}>
                    Déconnecter
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clé API LinkedIn</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Entrez votre clé API" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID de l'organisation</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: urn:li:organization:123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de notification (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                      {isSubmitting ? "Connexion..." : "Connecter le compte LinkedIn"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
