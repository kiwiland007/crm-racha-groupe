import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, Send, Users, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface WhatsAppIntegrationProps {
  contactPhone?: string;
  contactName?: string;
  className?: string;
}

export function WhatsAppIntegration({ contactPhone, contactName, className }: WhatsAppIntegrationProps) {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Templates de messages prédéfinis
  const messageTemplates = [
    {
      id: 1,
      title: "Devis disponible",
      content: `Bonjour ${contactName || '[Nom]'},\n\nVotre devis est prêt ! Nous avons préparé une proposition personnalisée pour vos besoins.\n\nSouhaitez-vous que nous planifions un rendez-vous pour en discuter ?\n\nCordialement,\nL'équipe Racha Business Group`
    },
    {
      id: 2,
      title: "Rappel rendez-vous",
      content: `Bonjour ${contactName || '[Nom]'},\n\nJe vous rappelle notre rendez-vous prévu demain à [HEURE] pour discuter de votre projet.\n\nN'hésitez pas à me contacter si vous avez des questions.\n\nÀ bientôt,\nRacha Business Group`
    },
    {
      id: 3,
      title: "Suivi installation",
      content: `Bonjour ${contactName || '[Nom]'},\n\nJ'espère que l'installation s'est bien déroulée. Nos équipes sont-elles intervenues selon vos attentes ?\n\nN'hésitez pas à nous faire part de vos retours.\n\nCordialement,\nRacha Business Group`
    },
    {
      id: 4,
      title: "Maintenance programmée",
      content: `Bonjour ${contactName || '[Nom]'},\n\nNous avons programmé la maintenance de vos équipements pour [DATE].\n\nNos techniciens interviendront entre [HEURE DÉBUT] et [HEURE FIN].\n\nCordialement,\nRacha Business Group`
    }
  ];

  const handleSendMessage = (messageContent: string) => {
    if (!contactPhone) {
      toast.error("Numéro de téléphone manquant");
      return;
    }

    // Nettoyer le numéro de téléphone
    const cleanPhone = contactPhone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    
    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(messageContent);
    
    // Créer l'URL WhatsApp
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    toast.success("WhatsApp ouvert", {
      description: `Message prêt à envoyer à ${contactName || contactPhone}`
    });
    
    setIsOpen(false);
    setMessage("");
  };

  const handleCustomMessage = () => {
    if (!message.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }
    handleSendMessage(message);
  };

  const formatPhoneForDisplay = (phone: string) => {
    if (!phone) return "";
    return phone.replace(/(\+212)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`gap-2 text-green-600 border-green-200 hover:bg-green-50 ${className}`}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Envoyer un message WhatsApp
          </DialogTitle>
          <DialogDescription>
            {contactName && (
              <div className="flex items-center gap-2 mt-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">{contactName}</span>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {formatPhoneForDisplay(contactPhone || "")}
                </Badge>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Templates de messages */}
          <div>
            <h3 className="text-sm font-medium mb-3">Messages prédéfinis</h3>
            <div className="grid gap-2">
              {messageTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{template.title}</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSendMessage(template.content)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs line-clamp-2">
                      {template.content.substring(0, 100)}...
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Message personnalisé */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-3">Message personnalisé</h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Tapez votre message ici..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleCustomMessage}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Composant pour les statistiques WhatsApp
export function WhatsAppStats() {
  const stats = [
    { label: "Messages envoyés", value: "156", trend: "+12%" },
    { label: "Taux de réponse", value: "78%", trend: "+5%" },
    { label: "Leads convertis", value: "23", trend: "+8%" },
    { label: "Temps de réponse moyen", value: "2h", trend: "-15%" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          Statistiques WhatsApp Business
        </CardTitle>
        <CardDescription>
          Performance de vos communications WhatsApp ce mois
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{stat.value}</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    stat.trend.startsWith('+') 
                      ? 'text-green-600 border-green-200' 
                      : 'text-blue-600 border-blue-200'
                  }`}
                >
                  {stat.trend}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Hook pour les fonctionnalités WhatsApp
export function useWhatsApp() {
  const sendQuickMessage = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendQuote = (phone: string, clientName: string, quoteId: string) => {
    const message = `Bonjour ${clientName},\n\nVotre devis ${quoteId} est disponible. Vous pouvez le consulter et le télécharger depuis votre espace client.\n\nN'hésitez pas à nous contacter pour toute question.\n\nCordialement,\nRacha Business Group`;
    sendQuickMessage(phone, message);
  };

  const sendAppointmentReminder = (phone: string, clientName: string, date: string, time: string) => {
    const message = `Bonjour ${clientName},\n\nRappel de votre rendez-vous prévu le ${date} à ${time}.\n\nNous vous attendons dans nos locaux.\n\nÀ bientôt,\nRacha Business Group`;
    sendQuickMessage(phone, message);
  };

  return {
    sendQuickMessage,
    sendQuote,
    sendAppointmentReminder
  };
}
