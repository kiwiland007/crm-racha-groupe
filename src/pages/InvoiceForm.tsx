
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Smartphone } from "lucide-react";
import { generatePDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const invoiceSchema = z.object({
  clientName: z.string().min(2, {
    message: "Le nom du client doit comporter au moins 2 caractères",
  }),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email({ message: "Email invalide" }).optional().or(z.literal('')),
  serviceType: z.string().min(1, {
    message: "Veuillez sélectionner un type de service",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Le montant doit être un nombre valide",
  }),
  advanceAmount: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Le montant de l'avance doit être un nombre valide",
  }),
  paymentMethod: z.string().min(1, {
    message: "Veuillez sélectionner un mode de paiement",
  }),
  description: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const InvoiceForm = () => {
  const isMobile = useIsMobile();
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      serviceType: "",
      amount: "",
      advanceAmount: "",
      paymentMethod: "",
      description: "",
    },
  });

  const onSubmit = (data: InvoiceFormValues) => {
    console.log("Données de facturation:", data);
    
    // Créer un objet facture pour la génération du PDF
    const invoice = {
      id: `INV-${Math.floor(Math.random() * 1000)}`,
      client: data.clientName,
      date: new Date().toLocaleDateString('fr-FR'),
      amount: parseInt(data.amount),
      advanceAmount: parseInt(data.advanceAmount) || 0,
      status: parseInt(data.advanceAmount) >= parseInt(data.amount) ? "Payée" : "En attente",
      paymentMethod: data.paymentMethod,
      description: data.description || `Service: ${data.serviceType}`,
      clientPhone: data.clientPhone,
      clientEmail: data.clientEmail
    };
    
    // Afficher un toast de succès
    toast.success(`Facture créée avec succès pour ${data.clientName}`, {
      description: `Montant: ${parseInt(data.amount).toLocaleString()} MAD`,
      action: {
        label: 'Générer PDF',
        onClick: () => generatePDF(invoice, 'invoice')
      }
    });
    
    // Option pour générer directement le PDF
    if (confirm("Voulez-vous générer un PDF pour cette facture?")) {
      generatePDF(invoice, 'invoice');
    }
  };
  
  const remainingAmount = () => {
    const amount = parseFloat(form.watch("amount") || "0");
    const advanceAmount = parseFloat(form.watch("advanceAmount") || "0");
    return amount - advanceAmount;
  };
  
  const getPaymentStatus = () => {
    const amount = parseFloat(form.watch("amount") || "0");
    const advanceAmount = parseFloat(form.watch("advanceAmount") || "0");
    
    if (!amount) return null;
    
    if (advanceAmount <= 0) {
      return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    } else if (advanceAmount >= amount) {
      return <Badge className="bg-green-100 text-green-800">Payée</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800">Paiement partiel</Badge>;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Création de facture</CardTitle>
        {isMobile && <Smartphone className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du client</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom du client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="clientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone du client</FormLabel>
                    <FormControl>
                      <Input placeholder="+212 661 123 456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email du client</FormLabel>
                  <FormControl>
                    <Input placeholder="client@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de service</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="location">Location</SelectItem>
                      <SelectItem value="evenement">Organisation d'événement</SelectItem>
                      <SelectItem value="matériel">Vente de matériel</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant total (MAD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="advanceAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant de l'avance (MAD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs flex justify-between">
                      {form.watch("amount") && (
                        <>
                          <span>
                            {`Reste: ${remainingAmount().toLocaleString()} MAD`}
                          </span>
                          {form.watch("advanceAmount") && (
                            <span>
                              {`(${Math.round((parseInt(form.watch("advanceAmount")) / parseInt(form.watch("amount"))) * 100)}%)`}
                            </span>
                          )}
                        </>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de paiement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un mode de paiement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="especes">Espèces</SelectItem>
                        <SelectItem value="cheque">Chèque</SelectItem>
                        <SelectItem value="virement">Virement bancaire</SelectItem>
                        <SelectItem value="carte">Carte bancaire</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-end">
                <div className="space-y-2 w-full">
                  <FormLabel>Statut du paiement</FormLabel>
                  <div className="h-10 flex items-center">
                    {getPaymentStatus()}
                  </div>
                </div>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Détails supplémentaires sur la facture..."
                      {...field} 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full flex gap-2">
              <FileText className="h-4 w-4" />
              Créer la facture
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground flex justify-center">
        Tous les montants sont affichés en Dirhams marocains (MAD)
      </CardFooter>
    </Card>
  );
};

export default InvoiceForm;
