
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, MoreVertical, Plus, Search, FileText, MessageCircle, Eye, Edit, Trash2, Receipt, Mail, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { AdvancedQuoteForm } from "@/components/invoices/AdvancedQuoteForm";
import { pdfServiceFixed, PDFQuoteData } from "@/services/pdfServiceFixed";
import { WhatsAppIntegration } from "@/components/whatsapp/WhatsAppIntegration";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Quotes() {
  const isMobile = useIsMobile();

  const [quotes, setQuotes] = useState([
    {
      id: "DEV-001",
      client: "Société ABC",
      date: "05/08/2025",
      amount: 15000,
      advanceAmount: 5000,
      status: "Émis",
      paymentMethod: "Virement",
      description: "Configuration des écrans tactiles pour salon Média",
      clientPhone: "+212 661 234 567",
      clientEmail: "contact@societeabc.ma"
    },
    {
      id: "DEV-002",
      client: "Event Pro Services",
      date: "02/08/2025",
      amount: 8500,
      advanceAmount: 3000,
      status: "En attente",
      paymentMethod: "Chèque",
      description: "Maintenance des bornes interactives",
      clientPhone: "+212 662 345 678",
      clientEmail: "contact@eventpro.ma"
    },
    {
      id: "DEV-003",
      client: "Hotel Marrakech",
      date: "29/07/2025",
      amount: 22000,
      advanceAmount: 10000,
      status: "Accepté",
      paymentMethod: "Carte bancaire",
      description: "Installation système interactif pour l'accueil",
      clientPhone: "+212 663 456 789",
      clientEmail: "reservation@hotelmarrakech.ma"
    },
  ]);

  const [openQuoteForm, setOpenQuoteForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleAddQuote = (quoteData: any) => {
    const newQuote = {
      id: quoteData.id,
      client: quoteData.client,
      date: quoteData.date,
      amount: quoteData.total,
      advanceAmount: 0,
      status: quoteData.status,
      paymentMethod: quoteData.paymentTerms,
      description: quoteData.description || quoteData.projectName,
      clientPhone: quoteData.clientPhone || "",
      clientEmail: quoteData.clientEmail || ""
    };

    setQuotes([newQuote, ...quotes]);

    // Générer automatiquement le PDF
    const filename = pdfServiceFixed.generateQuotePDF(quoteData, 'quote');
    if (filename) {
      toast.success("Devis créé et PDF généré", {
        description: `Devis ${quoteData.id} pour ${quoteData.client}`
      });
    }

    return newQuote;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Émis":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 gap-1">
            <FileText size={12} />
            Émis
          </Badge>
        );
      case "Accepté":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 gap-1">
            <CheckCircle size={12} />
            Accepté
          </Badge>
        );
      case "Facturé":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100 gap-1">
            <Receipt size={12} />
            Facturé
          </Badge>
        );
      case "En attente":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 gap-1">
            <Clock size={12} />
            En attente
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <AlertCircle size={12} />
            {status}
          </Badge>
        );
    }
  };

  const handleGeneratePDF = (quote: any) => {
    // Convertir le devis au format PDFQuoteData
    const pdfData: PDFQuoteData = {
      id: quote.id,
      client: quote.client,
      clientPhone: quote.clientPhone,
      clientEmail: quote.clientEmail,
      projectName: quote.description,
      description: quote.description,
      date: quote.date,
      items: [
        {
          type: "service",
          name: quote.description,
          description: "Service principal",
          quantity: 1,
          unitPrice: quote.amount,
          discount: 0
        }
      ],
      subtotal: quote.amount,
      discount: 0,
      tax: Math.round(quote.amount * 0.2),
      total: Math.round(quote.amount * 1.2),
      taxRate: 20,
      paymentTerms: quote.paymentMethod,
      validityDays: 30,
      notes: `Devis généré automatiquement pour ${quote.client}`,
      status: quote.status
    };

    const filename = pdfServiceFixed.generateQuotePDF(pdfData, 'quote');
    if (filename) {
      toast.success("PDF généré", {
        description: `Devis ${quote.id} pour ${quote.client}`
      });
    }
  };

  const handleGenerateAllPDFs = () => {
    // Fonction temporairement désactivée - service de liste PDF à implémenter
    toast.info("Fonctionnalité en développement", {
      description: "Génération de liste PDF bientôt disponible"
    });
  };

  const handleViewDetails = (quote: any) => {
    toast.info("Détails du devis", {
      description: `Affichage des détails du devis ${quote.id}`
    });
  };

  const handleEditQuote = (quote: any) => {
    setEditingQuote(quote);
    setOpenQuoteForm(true);
  };

  const handleUpdateQuote = (quoteData: any) => {
    const updatedQuotes = quotes.map(quote =>
      quote.id === quoteData.id ? { ...quote, ...quoteData } : quote
    );
    setQuotes(updatedQuotes);
    setEditingQuote(null);
    toast.success("Devis modifié avec succès");
  };

  const handleConvertToInvoice = (quote: any) => {
    // Convertir le devis en facture
    const updatedQuotes = quotes.map(q =>
      q.id === quote.id ? { ...q, status: "Facturé" } : q
    );
    setQuotes(updatedQuotes);

    // Créer une nouvelle facture basée sur le devis
    const newInvoice = {
      id: `INV-${Date.now()}`,
      quoteId: quote.id,
      client: quote.client,
      clientEmail: quote.clientEmail,
      clientPhone: quote.clientPhone,
      projectName: quote.description,
      amount: quote.amount,
      advanceAmount: quote.advanceAmount,
      remainingAmount: quote.amount - quote.advanceAmount,
      paymentMethod: quote.paymentMethod,
      date: new Date().toLocaleDateString('fr-FR'),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'), // 30 jours
      status: "En attente",
      items: quote.items || [],
      notes: `Facture générée automatiquement à partir du devis ${quote.id}`,
      createdAt: new Date().toISOString()
    };

    // Sauvegarder la facture dans le localStorage
    const existingInvoices = JSON.parse(localStorage.getItem('crm_invoices') || '[]');
    const updatedInvoices = [...existingInvoices, newInvoice];
    localStorage.setItem('crm_invoices', JSON.stringify(updatedInvoices));

    toast.success("Devis converti en facture", {
      description: `Facture ${newInvoice.id} créée avec succès`,
      action: {
        label: "Voir factures",
        onClick: () => window.location.href = "/invoices"
      }
    });
  };

  const handleSendEmail = (quote: any) => {
    if (quote.clientEmail) {
      const subject = `Devis ${quote.id} - ${quote.client}`;
      const body = `Bonjour,\n\nVeuillez trouver ci-joint votre devis ${quote.id}.\n\nCordialement,\nRacha Business Digital`;
      const mailtoUrl = `mailto:${quote.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl);

      toast.success("Email ouvert", {
        description: `Email préparé pour ${quote.client}`
      });
    } else {
      toast.error("Email non disponible", {
        description: "Aucune adresse email pour ce client"
      });
    }
  };

  const handleDeleteQuote = (quote: any) => {
    const updatedQuotes = quotes.filter(q => q.id !== quote.id);
    setQuotes(updatedQuotes);

    toast.success("Devis supprimé", {
      description: `Devis ${quote.id} supprimé avec succès`
    });
  };

  const handleSendWhatsApp = (quote: any) => {
    if (quote.clientPhone) {
      const cleanPhone = quote.clientPhone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
      const message = `Bonjour ${quote.client},\n\nVotre devis ${quote.id} d'un montant de ${quote.amount.toLocaleString()} MAD est disponible.\n\nDescription: ${quote.description}\n\nCordialement,\nRacha Business Digital\n📞 +212 6 69 38 28 28`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      toast.success("WhatsApp ouvert", {
        description: `Message prêt pour ${quote.client}`
      });
    } else {
      toast.error("Téléphone non disponible", {
        description: "Aucun numéro de téléphone pour ce client"
      });
    }
  };

  return (
    <Layout title="Devis">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher des devis..."
                className="pl-8 bg-white border-gray-200 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
              <Filter size={16} />
              Filtres
            </Button>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button className="gap-2 flex-1 md:flex-auto" onClick={() => setOpenQuoteForm(true)}>
              <Plus size={16} />
              Nouveau devis
            </Button>
            <Button variant="outline" className="gap-2 flex-1 md:flex-auto" onClick={handleGenerateAllPDFs}>
              <FileText size={16} />
              {isMobile ? "PDF" : "Générer liste PDF"}
            </Button>
          </div>
        </div>

        {/* Indicateur de workflow */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Workflow Commercial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  <FileText size={14} />
                  <span>Devis</span>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded">
                  <CheckCircle size={14} />
                  <span>Accepté</span>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded">
                  <Receipt size={14} />
                  <span>Facturé</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Processus automatisé de conversion
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Devis récents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N°</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Description</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Date</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Avance</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Mode</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.filter(quote => {
                    const matchesSearch = quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        quote.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        quote.description.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
                    return matchesSearch && matchesStatus;
                  }).map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.id}</TableCell>
                      <TableCell>{quote.client}</TableCell>
                      <TableCell className={`${isMobile ? "hidden" : ""} max-w-[200px] truncate`}>{quote.description}</TableCell>
                      <TableCell className={isMobile ? "hidden" : ""}>{quote.date}</TableCell>
                      <TableCell className="text-right">{quote.amount.toLocaleString()} MAD</TableCell>
                      <TableCell className={isMobile ? "hidden" : ""}>
                        {quote.advanceAmount.toLocaleString()} MAD
                        {quote.amount > 0 && (
                          <span className="text-xs text-gray-500 block">
                            {Math.round((quote.advanceAmount / quote.amount) * 100)}%
                          </span>
                        )}
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(quote)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditQuote(quote)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleConvertToInvoice(quote)}>
                              <Receipt className="mr-2 h-4 w-4" />
                              Convertir en facture
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendEmail(quote)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Envoyer par email
                            </DropdownMenuItem>
                            {quote.clientPhone && (
                              <DropdownMenuItem onClick={() => handleSendWhatsApp(quote)}>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Envoyer WhatsApp
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteQuote(quote)}>
                              <Trash2 className="mr-2 h-4 w-4" />
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
      </div>

      <AdvancedQuoteForm
        open={openQuoteForm}
        onOpenChange={(open) => {
          setOpenQuoteForm(open);
          if (!open) setEditingQuote(null);
        }}
        onSave={editingQuote ? handleUpdateQuote : handleAddQuote}
        type="quote"
        editingData={editingQuote}
      />
    </Layout>
  );
}
