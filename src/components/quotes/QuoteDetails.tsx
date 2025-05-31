import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  User, 
  Calendar, 
  DollarSign, 
  Phone, 
  Mail, 
  CreditCard,
  Clock,
  CheckCircle,
  Receipt,
  AlertCircle
} from "lucide-react";

interface Quote {
  id: string;
  client: string;
  date: string;
  amount: number;
  advanceAmount: number;
  status: string;
  paymentMethod: string;
  description: string;
  clientPhone?: string;
  clientEmail?: string;
}

interface QuoteDetailsProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGeneratePDF?: (quote: Quote) => void;
  onConvertToInvoice?: (quote: Quote) => void;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({
  quote,
  open,
  onOpenChange,
  onGeneratePDF,
  onConvertToInvoice,
}) => {
  if (!quote) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Émis":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "Accepté":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Facturé":
        return <Receipt className="h-4 w-4 text-purple-600" />;
      case "En attente":
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Émis":
        return "bg-blue-100 text-blue-800";
      case "Accepté":
        return "bg-green-100 text-green-800";
      case "Facturé":
        return "bg-purple-100 text-purple-800";
      case "En attente":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const remainingAmount = quote.amount - quote.advanceAmount;
  const advancePercentage = quote.amount > 0 ? Math.round((quote.advanceAmount / quote.amount) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6 text-blue-600" />
            Détails du devis {quote.id}
          </DialogTitle>
          <DialogDescription>
            Informations complètes du devis pour <span className="font-semibold text-gray-900">{quote.client}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Numéro de devis</p>
                  <p className="text-lg font-semibold">{quote.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Client</p>
                  <p className="text-lg font-semibold">{quote.client}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date d'émission</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-lg">{quote.date}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Statut</p>
                  <Badge className={`${getStatusColor(quote.status)} flex items-center gap-1 w-fit`}>
                    {getStatusIcon(quote.status)}
                    {quote.status}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Description du projet</p>
                <p className="text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg">{quote.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informations financières */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Informations financières
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-700 mb-1">Montant total</p>
                    <p className="text-3xl font-bold text-blue-800">
                      {quote.amount.toLocaleString()} MAD
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-700 mb-1">Avance demandée</p>
                    <p className="text-2xl font-bold text-green-800">
                      {quote.advanceAmount.toLocaleString()} MAD
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {advancePercentage}% du montant total
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm font-medium text-amber-700 mb-1">Montant restant</p>
                    <p className="text-2xl font-bold text-amber-800">
                      {remainingAmount.toLocaleString()} MAD
                    </p>
                    <p className="text-sm text-amber-600 mt-1">
                      {100 - advancePercentage}% du montant total
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Mode de paiement</p>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-600" />
                      <p className="text-lg font-semibold text-gray-800">{quote.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          {(quote.clientPhone || quote.clientEmail) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-purple-600" />
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quote.clientPhone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Téléphone</p>
                        <p className="text-lg font-semibold">{quote.clientPhone}</p>
                      </div>
                    </div>
                  )}
                  {quote.clientEmail && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p className="text-lg font-semibold">{quote.clientEmail}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => onGeneratePDF?.(quote)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Générer PDF
                </Button>
                
                {quote.status === "Accepté" && (
                  <Button 
                    onClick={() => onConvertToInvoice?.(quote)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Receipt className="h-4 w-4" />
                    Convertir en facture
                  </Button>
                )}
                
                {quote.clientEmail && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const subject = `Devis ${quote.id} - ${quote.client}`;
                      const body = `Bonjour,\n\nVeuillez trouver ci-joint votre devis ${quote.id}.\n\nCordialement,\nRacha Business Group`;
                      window.open(`mailto:${quote.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Envoyer par email
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDetails;
