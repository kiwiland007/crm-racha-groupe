
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
import { Filter, MoreVertical, Plus, Search } from "lucide-react";
import { QuoteForm } from "@/components/invoices/QuoteForm";

export default function Quotes() {
  const [quotes, setQuotes] = useState([
    {
      id: "DEV-001",
      client: "Société ABC",
      date: "05/08/2025",
      amount: 15000,
      advanceAmount: 5000,
      status: "Émis",
      paymentMethod: "Virement",
      description: "Configuration des écrans tactiles pour salon Média"
    },
    {
      id: "DEV-002",
      client: "Event Pro Services",
      date: "02/08/2025",
      amount: 8500,
      advanceAmount: 3000,
      status: "En attente",
      paymentMethod: "Chèque",
      description: "Maintenance des bornes interactives"
    },
    {
      id: "DEV-003",
      client: "Hotel Marrakech",
      date: "29/07/2025",
      amount: 22000,
      advanceAmount: 10000,
      status: "Accepté",
      paymentMethod: "Carte bancaire",
      description: "Installation système interactif pour l'accueil"
    },
  ]);
  
  const [openQuoteForm, setOpenQuoteForm] = useState(false);

  const handleAddQuote = (quoteData: any) => {
    const newQuote = {
      id: `DEV-00${quotes.length + 1}`,
      client: quoteData.client,
      date: formatDate(new Date(quoteData.date)),
      amount: parseInt(quoteData.amount),
      advanceAmount: quoteData.advanceAmount ? parseInt(quoteData.advanceAmount) : 0,
      status: "Émis",
      paymentMethod: quoteData.paymentMethod,
      description: quoteData.description
    };
    
    setQuotes([newQuote, ...quotes]);
    
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
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Émis</Badge>;
      case "Accepté":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Accepté</Badge>;
      case "Facturé":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Facturé</Badge>;
      case "En attente":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout title="Devis">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher des devis..."
                className="pl-8 bg-white border-gray-200 w-full"
              />
            </div>
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
              <Filter size={16} />
              Filtres
            </Button>
          </div>
          <Button className="gap-2" onClick={() => setOpenQuoteForm(true)}>
            <Plus size={16} />
            Nouveau devis
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Devis récents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Montant (MAD)</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Avance (MAD)</TableHead>
                  <TableHead className="hidden md:table-cell">Mode</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>{quote.client}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{quote.description}</TableCell>
                    <TableCell className="hidden md:table-cell">{quote.date}</TableCell>
                    <TableCell className="text-right">{quote.amount.toLocaleString()} MAD</TableCell>
                    <TableCell className="hidden md:table-cell text-right">{quote.advanceAmount.toLocaleString()} MAD</TableCell>
                    <TableCell className="hidden md:table-cell">{quote.paymentMethod}</TableCell>
                    <TableCell>{getStatusBadge(quote.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Voir détails</DropdownMenuItem>
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Convertir en facture</DropdownMenuItem>
                          <DropdownMenuItem>Envoyer par email</DropdownMenuItem>
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
          </CardContent>
        </Card>
      </div>
      
      <QuoteForm 
        open={openQuoteForm} 
        onOpenChange={setOpenQuoteForm}
        onAddQuote={handleAddQuote}
      />
    </Layout>
  );
}
