import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInvoiceContext } from "@/contexts/InvoiceContext";
import { useBLContext } from "@/contexts/BLContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  Plus,
  MoreVertical,
  Download,
  Edit,
  Eye,
  Trash2,
  Filter,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AdvancedQuoteForm } from "@/components/invoices/AdvancedQuoteForm";
import { WhatsAppIntegration } from "@/components/whatsapp/WhatsAppIntegration";
import { pdfServiceFixed, PDFQuoteData } from "@/services/pdfServiceFixed";

export default function Invoices() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, getTotalAmount, getPaidAmount } = useInvoiceContext();
  const { createBLFromInvoice } = useBLContext();

  const [openInvoiceForm, setOpenInvoiceForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleAddInvoice = (invoiceData: any) => {
    const newInvoiceData = {
      client: invoiceData.client,
      clientPhone: invoiceData.clientPhone || "",
      clientEmail: invoiceData.clientEmail || "",
      projectName: invoiceData.projectName || invoiceData.description,
      description: invoiceData.description || invoiceData.projectName,
      date: invoiceData.date,
      amount: invoiceData.total,
      advanceAmount: invoiceData.advanceAmount || 0,
      status: invoiceData.status,
      paymentMethod: invoiceData.paymentTerms,
      items: invoiceData.items || []
    };

    const newInvoice = addInvoice(newInvoiceData);

    // Générer automatiquement le PDF
    const filename = pdfServiceFixed.generateQuotePDF(invoiceData, 'invoice');
    if (filename) {
      toast.success("PDF généré", {
        description: `PDF de la facture ${newInvoice.id} généré`
      });
    }

    return newInvoice;
  };

  const handleUpdateInvoice = (invoiceData: any) => {
    updateInvoice(invoiceData.id, invoiceData);
    setEditingInvoice(null);
  };

  const handleEditInvoice = (invoice: any) => {
    setEditingInvoice(invoice);
    setOpenInvoiceForm(true);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    deleteInvoice(invoiceId);
  };

  const handleGeneratePDF = (invoice: any) => {
    console.log("=== GÉNÉRATION PDF FACTURE ===");
    console.log("Données facture:", invoice);

    try {
      // Convertir les données de facture au format attendu par le service PDF
      const pdfData: PDFQuoteData = {
        id: invoice.id || `FAC-${Date.now()}`,
        client: invoice.client || "Client non spécifié",
        clientEmail: invoice.clientEmail || "",
        clientPhone: invoice.clientPhone || "",
        clientAddress: invoice.clientAddress || "",
        projectName: invoice.projectName || "Projet",
        description: invoice.description || "Service",
        date: invoice.date || new Date().toLocaleDateString('fr-FR'),
        items: invoice.items && invoice.items.length > 0 ? invoice.items.map((item: any) => ({
          type: item.type || "service" as const,
          name: item.name || item.description || "Service",
          description: item.description || item.name || "Description",
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || item.price || invoice.amount || 0,
          discount: item.discount || 0,
        })) : [
          {
            type: "service" as const,
            name: invoice.projectName || "Service",
            description: invoice.description || "Service fourni",
            quantity: 1,
            unitPrice: invoice.amount || 0,
            discount: 0,
          }
        ],
        subtotal: invoice.amount || 0,
        discount: 0,
        tax: invoice.tax || 0,
        total: invoice.amount || 0,
        taxRate: invoice.taxRate || 0,
        paymentTerms: invoice.paymentMethod || "Selon conditions convenues",
        validityDays: 30,
        notes: invoice.notes || "",
        status: invoice.status || "En attente",
      };

      console.log("Données PDF formatées:", pdfData);

      const filename = pdfServiceFixed.generateQuotePDF(pdfData, 'invoice');
      if (filename) {
        toast.success("PDF généré avec succès", {
          description: `Le fichier ${filename} a été téléchargé.`,
        });
      } else {
        toast.error("Erreur génération PDF", {
          description: "Impossible de générer le PDF de la facture"
        });
      }
    } catch (error) {
      console.error("Erreur génération PDF facture:", error);
      toast.error("Erreur génération PDF", {
        description: `Erreur: ${error.message || 'Erreur inconnue'}`
      });
    }
  };

  const handleCloseForm = (open: boolean) => {
    setOpenInvoiceForm(open);
    if (!open) {
      setEditingInvoice(null);
    }
  };

  const handleCreateBL = (invoice: any) => {
    const blData = {
      clientAdresse: "Adresse à compléter",
      dateLivraison: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      livreur: "À assigner",
      transporteur: "Transport interne",
      modeLivraison: "livraison_directe" as const,
      items: invoice.items?.map((item: any, index: number) => ({
        id: index + 1,
        productName: item.name || invoice.projectName,
        category: "Service",
        quantity: item.quantity || 1,
        quantiteCommandee: item.quantity || 1,
        quantiteLivree: 0,
        quantiteRestante: item.quantity || 1,
        unitPrice: item.unitPrice || invoice.amount,
        totalPrice: item.unitPrice * item.quantity || invoice.amount
      })) || [{
        id: 1,
        productName: invoice.projectName,
        category: "Service",
        quantity: 1,
        quantiteCommandee: 1,
        quantiteLivree: 0,
        quantiteRestante: 1,
        unitPrice: invoice.amount,
        totalPrice: invoice.amount
      }],
      totalColis: 1,
      conditionsLivraison: "Livraison standard"
    };

    const newBL = createBLFromInvoice(invoice.id, blData);
    if (newBL) {
      toast.success("BL créé", {
        description: `BL ${newBL.id} créé pour la facture ${invoice.id}`,
        action: {
          label: "Voir BL",
          onClick: () => window.open('/bon-livraison', '_blank')
        }
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      "Payée": { label: "Payée", color: "bg-green-100 text-green-800" },
      "En attente": { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
      "Partiellement payée": { label: "Partiellement payée", color: "bg-blue-100 text-blue-800" },
      "Annulée": { label: "Annulée", color: "bg-red-100 text-red-800" },
      "Brouillon": { label: "Brouillon", color: "bg-gray-100 text-gray-800" },
    };

    const statusInfo = statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" };

    return (
      <Badge variant="outline" className={`${statusInfo.color} hover:${statusInfo.color}`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.projectName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalAmount = getTotalAmount();
  const paidAmount = getPaidAmount();

  return (
    <Layout title="Factures">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
          <p className="text-gray-600">Gérez vos factures et suivez les paiements</p>
        </div>
        <Button className="gap-2 mt-4 md:mt-0" onClick={() => setOpenInvoiceForm(true)}>
          <Plus size={16} />
          Nouvelle facture
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total factures</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredInvoices.length}</div>
            <p className="text-xs text-muted-foreground">
              {totalAmount.toLocaleString()} MAD au total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant payé</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidAmount.toLocaleString()} MAD</div>
            <p className="text-xs text-muted-foreground">
              {((paidAmount / totalAmount) * 100 || 0).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {(totalAmount - paidAmount).toLocaleString()} MAD
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter(i => i.status !== "Payée").length} factures
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher une facture..."
            className="pl-8 bg-white border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Statut: {statusFilter === "all" ? "Tous" : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              Tous les statuts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter("Payée")}>
              Payée
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("En attente")}>
              En attente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Partiellement payée")}>
              Partiellement payée
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Annulée")}>
              Annulée
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{invoice.id}</CardTitle>
                  <CardDescription className="mt-1">
                    {invoice.client}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir détails
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleGeneratePDF(invoice)}>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCreateBL(invoice)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Créer BL
                    </DropdownMenuItem>
                    {invoice.clientPhone && (
                      <DropdownMenuItem
                        onClick={() => {
                          const cleanPhone = invoice.clientPhone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
                          const message = `Bonjour ${invoice.client},\n\nVotre facture ${invoice.id} d'un montant de ${invoice.amount.toLocaleString()} MAD est disponible.\n\nPour: ${invoice.projectName}\n\nCordialement,\nRacha Business Digital\n📞 +212 6 69 38 28 28`;
                          const encodedMessage = encodeURIComponent(message);
                          const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
                          window.open(whatsappUrl, '_blank');
                          toast.success("WhatsApp ouvert", {
                            description: `Message prêt pour ${invoice.client}`
                          });
                        }}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Envoyer WhatsApp
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteInvoice(invoice.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(invoice.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {invoice.projectName}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{invoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Montant:</span>
                  <span className="font-bold text-lg">{invoice.amount.toLocaleString()} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Paiement:</span>
                  <span className="font-medium">{invoice.paymentMethod}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleGeneratePDF(invoice)}
                >
                  <FileText size={14} />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleEditInvoice(invoice)}
                >
                  <Edit size={14} />
                  Modifier
                </Button>
                {invoice.clientPhone && (
                  <WhatsAppIntegration
                    contactPhone={invoice.clientPhone}
                    contactName={invoice.client}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune facture</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "Aucun résultat pour vos critères de recherche."
              : "Commencez par créer votre première facture."
            }
          </p>
          {!searchTerm && statusFilter === "all" && (
            <div className="mt-6">
              <Button onClick={() => setOpenInvoiceForm(true)} className="gap-2">
                <Plus size={16} />
                Nouvelle facture
              </Button>
            </div>
          )}
        </div>
      )}

      <AdvancedQuoteForm
        open={openInvoiceForm}
        onOpenChange={(open) => {
          setOpenInvoiceForm(open);
          if (!open) setEditingInvoice(null);
        }}
        onSave={editingInvoice ? handleUpdateInvoice : handleAddInvoice}
        type="invoice"
        editingData={editingInvoice}
      />
    </Layout>
  );
}
