
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuoteContext } from "@/contexts/QuoteContext";
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
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Filter, MoreVertical, Plus, Search, FileText, MessageCircle, Eye, Edit, Trash2, Receipt, Mail, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { AdvancedQuoteForm } from "@/components/invoices/AdvancedQuoteForm";
import { pdfServiceFixed, PDFQuoteData } from "@/services/pdfServiceFixed";
import { WhatsAppIntegration } from "@/components/whatsapp/WhatsAppIntegration";
import QuoteDetails from "@/components/quotes/QuoteDetails";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Quote, QuoteItem as GlobalQuoteItem } from "@/contexts/QuoteContext"; // Adjusted import

interface QuotePageFormData {
  id?: string;
  client: string;
  clientPhone?: string;
  clientEmail?: string;
  date: string;
  total: number;
  status: Quote['status'];
  paymentTerms: string;
  description: string;
  projectName?: string;
  items?: GlobalQuoteItem[]; // Use imported QuoteItem
  validityDays?: number;
  advanceAmount?: number;
  // For PDF generation, ensure all fields for PDFQuoteData are here or mapped
  clientAddress?: string; // Example: if needed for PDF but not core Quote
  tax?: number;
  taxRate?: number;
  notes?: string;
}

export default function Quotes() {
  const isMobile = useIsMobile();
  const { quotes, addQuote, updateQuote, deleteQuote, convertToInvoice } = useQuoteContext();

  const [openQuoteForm, setOpenQuoteForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const handleAddQuote = (quoteData: QuotePageFormData) => {
    const newQuoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'> = {
      client: quoteData.client,
      date: quoteData.date,
      amount: quoteData.total,
      advanceAmount: quoteData.advanceAmount || 0,
      status: quoteData.status,
      paymentMethod: quoteData.paymentTerms,
      description: quoteData.description || quoteData.projectName || "",
      clientPhone: quoteData.clientPhone || "",
      clientEmail: quoteData.clientEmail || "",
      items: quoteData.items || [],
      validityDays: quoteData.validityDays || 30,
      notes: quoteData.notes, // ensure notes is part of newQuoteData if it's in Quote type
    };

    const newQuote = addQuote(newQuoteData);

    // Prepare data for PDF generation, mapping from QuotePageFormData
    const pdfDataForService: PDFQuoteData = {
      ...newQuote, // Spread the created quote
      clientAddress: quoteData.clientAddress || "",
      projectName: quoteData.projectName || newQuote.description,
      subtotal: newQuote.amount,
      discount: 0, // Default or map if available
      tax: quoteData.tax || Math.round(newQuote.amount * ( (quoteData.taxRate || 20) / 100)),
      total: newQuote.amount + (quoteData.tax || Math.round(newQuote.amount * ( (quoteData.taxRate || 20) / 100))),
      taxRate: quoteData.taxRate || 20,
      paymentTerms: newQuote.paymentMethod,
      validityDays: newQuote.validityDays || 30,
      notes: newQuote.notes || `Devis généré automatiquement pour ${newQuote.client}`,
    };

    const filename = pdfServiceFixed.generateQuotePDF(pdfDataForService, 'quote');
    if (filename) {
      toast.success("PDF généré", {
        description: `PDF du devis ${newQuote.id} généré`
      });
    }

    return newQuote;
  };

  const formatDate = (date: Date) => { // This function is unused
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

  const handleGeneratePDF = (quote: Quote) => {
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

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowQuoteDetails(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setOpenQuoteForm(true);
  };

  const handleUpdateQuote = (quoteData: QuotePageFormData & { id: string }) => {
    const updateData: Partial<Quote> = {
      client: quoteData.client,
      clientPhone: quoteData.clientPhone,
      clientEmail: quoteData.clientEmail,
      date: quoteData.date,
      amount: quoteData.total,
      advanceAmount: quoteData.advanceAmount,
      status: quoteData.status,
      paymentMethod: quoteData.paymentTerms,
      description: quoteData.description,
      items: quoteData.items,
      validityDays: quoteData.validityDays,
      notes: quoteData.notes,
    };
    updateQuote(quoteData.id, updateData);
    setEditingQuote(null);
  };

  const handleConvertToInvoice = (quote: Quote) => {
    convertToInvoice(quote.id);
  };

  const handleSendEmail = (quote: Quote) => {
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

  const handleDeleteQuote = (quote: Quote) => {
    deleteQuote(quote.id);
  };

  const handleSendWhatsApp = (quote: Quote) => {
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter size={16} />
                  Filtres
                  {statusFilter !== "all" && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                      1
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  <div className="flex items-center justify-between w-full">
                    Tous les devis
                    {statusFilter === "all" && <CheckCircle className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Émis")}>
                  <div className="flex items-center justify-between w-full">
                    Émis
                    {statusFilter === "Émis" && <CheckCircle className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("En attente")}>
                  <div className="flex items-center justify-between w-full">
                    En attente
                    {statusFilter === "En attente" && <CheckCircle className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Accepté")}>
                  <div className="flex items-center justify-between w-full">
                    Accepté
                    {statusFilter === "Accepté" && <CheckCircle className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Facturé")}>
                  <div className="flex items-center justify-between w-full">
                    Facturé
                    {statusFilter === "Facturé" && <CheckCircle className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  Effacer les filtres
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      <QuoteDetails
        quote={selectedQuote}
        open={showQuoteDetails}
        onOpenChange={setShowQuoteDetails}
        onGeneratePDF={handleGeneratePDF}
        onConvertToInvoice={handleConvertToInvoice}
      />
    </Layout>
  );
}
