import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, MessageCircle, FileText, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { pdfServiceFixed, PDFQuoteData } from "@/services/pdfServiceFixed";
import { useIsMobile } from "@/hooks/use-mobile";

const quotes = [
  {
    id: "DEV-001",
    client: "Société ABC",
    date: "05/08/2025",
    amount: 15000,
    status: "Émis",
    paymentMethod: "Virement",
    description: "Configuration des écrans tactiles pour salon Média",
    contact: "+212 661 234 567",
    clientEmail: "contact@societeabc.ma"
  },
  {
    id: "DEV-002",
    client: "Event Pro Services",
    date: "02/08/2025",
    amount: 8500,
    status: "En attente",
    paymentMethod: "Chèque",
    description: "Maintenance des bornes interactives",
    contact: "+212 662 345 678",
    clientEmail: "contact@eventpro.ma"
  },
  {
    id: "DEV-003",
    client: "Hotel Marrakech",
    date: "29/07/2025",
    amount: 22000,
    status: "Accepté",
    paymentMethod: "Carte bancaire",
    description: "Installation système interactif pour l'accueil",
    contact: "+212 663 456 789",
    clientEmail: "reservation@hotelmarrakech.ma"
  },
  {
    id: "DEV-004",
    client: "Centre Commercial Anfa",
    date: "25/07/2025",
    amount: 35000,
    status: "Émis",
    paymentMethod: "30 jours",
    description: "Système d'affichage dynamique complet",
    contact: "+212 664 567 890",
    clientEmail: "gestion@anfa-mall.ma"
  }
];

export const RecentQuotes = React.memo(() => {
  const isMobile = useIsMobile();

  const handleWhatsappContact = (contact: string, quoteId: string, clientName: string) => {
    const cleanPhone = contact.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    const message = `Bonjour ${clientName},\n\nVotre devis ${quoteId} est disponible.\n\nCordialement,\nRacha Business Group`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    toast.success("WhatsApp ouvert", {
      description: `Message préparé pour ${clientName}`
    });
  };

  const handlePhoneCall = (contact: string) => {
    window.location.href = `tel:${contact.replace(/\s/g, '')}`;
    toast.success("Appel en cours", {
      description: `Appel vers ${contact}`
    });
  };

  const handleSMS = (contact: string, quoteId: string) => {
    const message = `Rappel concernant le devis ${quoteId}.`;
    window.location.href = `sms:${contact.replace(/\s/g, '')}?body=${encodeURIComponent(message)}`;
    toast.success("SMS préparé", {
      description: `SMS pour ${contact}`
    });
  };

  const handleGeneratePDF = (quote: Record<string, unknown>) => {
    // Convertir le devis au format PDFQuoteData
    const pdfData: PDFQuoteData = {
      id: String(quote.id || ''),
      client: String(quote.client || ''),
      clientPhone: String(quote.contact || ''),
      clientEmail: String(quote.clientEmail || ''),
      projectName: String(quote.description || ''),
      description: String(quote.description || ''),
      date: String(quote.date || ''),
      items: [
        {
          type: "service" as const,
          name: String(quote.description || ''),
          description: "Service principal",
          quantity: 1,
          unitPrice: Number(quote.amount || 0),
          discount: 0
        }
      ],
      subtotal: Number(quote.amount || 0),
      discount: 0,
      tax: Math.round(Number(quote.amount || 0) * 0.2),
      total: Math.round(Number(quote.amount || 0) * 1.2),
      taxRate: 20,
      paymentTerms: String(quote.paymentMethod || ''),
      validityDays: 30,
      notes: `Devis généré automatiquement pour ${quote.client}`,
      status: String(quote.status || '')
    };

    const filename = pdfServiceFixed.generateQuotePDF(pdfData, 'quote');
    if (filename) {
      toast.success("PDF généré", {
        description: `Devis ${quote.id} pour ${quote.client}`
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Émis":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Émis</Badge>;
      case "Accepté":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Accepté</Badge>;
      case "En attente":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">En attente</Badge>;
      case "Refusé":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Refusé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Devis récents</CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-2" : ""}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className={isMobile ? "hidden" : ""}>Date</TableHead>
                <TableHead className={isMobile ? "hidden" : ""}>Montant</TableHead>
                <TableHead className={isMobile ? "hidden" : ""}>Mode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.id}</TableCell>
                  <TableCell>{quote.client}</TableCell>
                  <TableCell className={isMobile ? "hidden" : ""}>{quote.date}</TableCell>
                  <TableCell className={isMobile ? "hidden" : ""}>{quote.amount.toLocaleString()} MAD</TableCell>
                  <TableCell className={isMobile ? "hidden" : ""}>{quote.paymentMethod}</TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleGeneratePDF(quote)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Générer PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePhoneCall(quote.contact)}>
                          <Phone className="mr-2 h-4 w-4" />
                          Appeler
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSMS(quote.contact, quote.id)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          SMS
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleWhatsappContact(quote.contact, quote.id, quote.client)}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Voir détails</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Convertir en facture</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
});

RecentQuotes.displayName = 'RecentQuotes';
