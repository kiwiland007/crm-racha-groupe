
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function Chat() {
  const [message, setMessage] = useState("");

  const contacts = [
    {
      id: 1,
      name: "Ahmed Dupont",
      role: "Admin",
      initials: "AD",
      lastMessage: "J'ai mis à jour le calendrier pour l'évènement",
      unread: 0,
      online: true
    },
    {
      id: 2,
      name: "Sofia Moussaoui",
      role: "Commercial",
      initials: "SM",
      lastMessage: "Le client a validé le devis final",
      unread: 2,
      online: true
    },
    {
      id: 3,
      name: "Karim Bennani",
      role: "Technicien",
      initials: "KB",
      lastMessage: "Installation terminée au siège de MarketPro",
      unread: 0,
      online: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Ahmed Dupont",
      initials: "AD",
      content: "Bonjour, comment se passent les préparatifs pour l'évènement Digital Tech ?",
      time: "09:34",
      isMe: false
    },
    {
      id: 2,
      sender: "Vous",
      initials: "ME",
      content: "Bonjour Ahmed ! Tout se passe bien, nous avons préparé toutes les bornes et écrans tactiles.",
      time: "09:36",
      isMe: true
    },
    {
      id: 3,
      sender: "Ahmed Dupont",
      initials: "AD",
      content: "Excellent ! Avons-nous confirmé les horaires avec le client ?",
      time: "09:38",
      isMe: false
    },
    {
      id: 4,
      sender: "Vous",
      initials: "ME",
      content: "Oui, l'installation est prévue le 11 mai à 14h, et l'événement commence le 12 mai à 9h.",
      time: "09:40",
      isMe: true
    },
    {
      id: 5,
      sender: "Ahmed Dupont",
      initials: "AD",
      content: "Parfait. N'oubliez pas de faire un inventaire complet du matériel avant le chargement dans le camion.",
      time: "09:42",
      isMe: false
    },
    {
      id: 6,
      sender: "Vous",
      initials: "ME",
      content: "Je m'en occupe cet après-midi, et je mettrai à jour le système une fois que tout sera vérifié.",
      time: "09:43",
      isMe: true
    }
  ];

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    
    toast.info("Envoi de message", {
      description: "La fonctionnalité de chat sera bientôt disponible."
    });
    
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Layout title="Messages">
      <div className="flex h-[calc(100vh-7rem)]">
        {/* Contact list */}
        <Card className="w-72 hidden md:block border-r rounded-r-none overflow-hidden">
          <div className="p-3 border-b">
            <Input 
              placeholder="Rechercher un contact..." 
              className="bg-gray-50"
            />
          </div>
          <ScrollArea className="h-[calc(100vh-11rem)] overflow-auto">
            <div className="p-2">
              {contacts.map((contact) => (
                <div 
                  key={contact.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer relative"
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback 
                        className={contact.id === 1 ? "bg-racha-teal text-white" : "bg-racha-blue text-white"}
                      >
                        {contact.initials}
                      </AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate text-sm">{contact.name}</p>
                      {contact.unread > 0 && (
                        <span className="ml-2 bg-racha-teal text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat area */}
        <Card className="flex-1 flex flex-col">
          <div className="p-3 border-b flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-racha-teal text-white">AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Ahmed Dupont</p>
              <p className="text-xs text-gray-500">En ligne</p>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${msg.isMe ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback 
                        className={msg.isMe ? "bg-racha-blue text-white" : "bg-racha-teal text-white"}
                      >
                        {msg.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${msg.isMe ? "text-racha-blue" : "text-racha-teal"}`}>
                          {msg.sender}
                        </span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <div 
                        className={`p-3 rounded-lg ${
                          msg.isMe 
                            ? "bg-racha-blue text-white" 
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input 
                placeholder="Écrivez votre message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
