import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, X, Calculator, FileText, Download } from "lucide-react";
import { pdfServiceFixed, PDFQuoteData } from "@/services/pdfServiceFixed";
import { useProductContext } from "@/contexts/ProductContext";

const itemSchema = z.object({
  type: z.enum(["device", "service"]),
  name: z.string().min(1, { message: "Le nom est requis" }),
  description: z.string().optional(),
  quantity: z.number().min(1, { message: "La quantité doit être supérieure à 0" }),
  unitPrice: z.number().min(0, { message: "Le prix unitaire doit être positif" }),
  discount: z.number().min(0).max(100).optional(),
  category: z.string().optional(),
});

const advancedQuoteSchema = z.object({
  client: z.string().min(1, { message: "Le client est requis" }),
  clientEmail: z.string().email().optional(),
  clientPhone: z.string().optional(),
  clientAddress: z.string().optional(),
  projectName: z.string().min(1, { message: "Le nom du projet est requis" }),
  description: z.string().optional(),
  items: z.array(itemSchema).min(1, { message: "Au moins un élément est requis" }),
  taxRate: z.number().min(0).max(100),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(0),
  paymentTerms: z.string(),
  validityDays: z.number().min(1),
  notes: z.string().optional(),
  // Champs spécifiques aux factures
  advanceAmount: z.number().min(0).optional(),
  advancePercentage: z.number().min(0).max(100).optional(),
  dueDate: z.string().optional(),
  invoiceNumber: z.string().optional(),
});

type AdvancedQuoteFormValues = z.infer<typeof advancedQuoteSchema>;

interface AdvancedQuoteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: AdvancedQuoteFormValues & { total: number; id: string }) => void;
  type: "quote" | "invoice";
  editingData?: any;
}

export function AdvancedQuoteForm({
  open,
  onOpenChange,
  onSave,
  type = "quote",
  editingData
}: AdvancedQuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { products, categories } = useProductContext();

  const form = useForm<AdvancedQuoteFormValues>({
    resolver: zodResolver(advancedQuoteSchema),
    defaultValues: {
      client: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      projectName: "",
      description: "",
      items: [
        {
          type: "device",
          name: "",
          description: "",
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          category: "",
        },
      ],
      taxRate: 20,
      discountType: "percentage",
      discountValue: 0,
      paymentTerms: "30 jours",
      validityDays: 30,
      notes: "",
      // Champs spécifiques aux factures
      advanceAmount: 0,
      advancePercentage: 0,
      dueDate: "",
      invoiceNumber: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Charger les données d'édition ou de contact
  useEffect(() => {
    if (editingData && open) {
      // Convertir les données existantes au format du formulaire
      const formData = {
        client: editingData.client || "",
        clientEmail: editingData.clientEmail || "",
        clientPhone: editingData.clientPhone || "",
        clientAddress: editingData.clientAddress || "",
        projectName: editingData.projectName || editingData.description || "",
        description: editingData.description || "",
        items: editingData.items || [
          {
            type: "device" as const,
            name: editingData.description || "Écran Tactile 32\"",
            description: "Configuration standard",
            quantity: 1,
            unitPrice: editingData.amount || 2500,
            discount: 0,
            category: "Écrans tactiles",
          }
        ],
        taxRate: 20,
        discountType: "percentage" as const,
        discountValue: 0,
        paymentTerms: editingData.paymentMethod || "30 jours",
        validityDays: 30,
        notes: editingData.notes || "",
        advanceAmount: editingData.advanceAmount || 0,
        advancePercentage: 0,
        dueDate: "",
        invoiceNumber: editingData.id || "",
      };

      // Réinitialiser le formulaire avec les nouvelles données
      form.reset(formData);
    } else if (!editingData && open) {
      // Réinitialiser avec les valeurs par défaut pour un nouveau document
      form.reset({
        client: "",
        clientEmail: "",
        clientPhone: "",
        clientAddress: "",
        projectName: "",
        description: "",
        items: [
          {
            type: "device",
            name: "",
            description: "",
            quantity: 1,
            unitPrice: 0,
            discount: 0,
            category: "",
          },
        ],
        taxRate: 20,
        discountType: "percentage",
        discountValue: 0,
        paymentTerms: "30 jours",
        validityDays: 30,
        notes: "",
        advanceAmount: 0,
        advancePercentage: 0,
        dueDate: "",
        invoiceNumber: "",
      });
    }
  }, [editingData, open, form]);

  const watchedItems = form.watch("items");
  const watchedTaxRate = form.watch("taxRate");
  const watchedDiscountType = form.watch("discountType");
  const watchedDiscountValue = form.watch("discountValue");

  // Calculs automatiques
  const calculateSubtotal = () => {
    return watchedItems.reduce((sum, item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      const itemDiscount = ((item.discount || 0) / 100) * itemTotal;
      return sum + (itemTotal - itemDiscount);
    }, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (watchedDiscountType === "percentage") {
      return (subtotal * (watchedDiscountValue || 0)) / 100;
    }
    return watchedDiscountValue || 0;
  };

  const calculateTax = () => {
    const subtotalAfterDiscount = calculateSubtotal() - calculateDiscount();
    return (subtotalAfterDiscount * (watchedTaxRate || 0)) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  };

  const addItem = (itemType: "device" | "service") => {
    append({
      type: itemType,
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      category: "",
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const getDeviceOptions = () => {
    return products
      .filter(product => {
        const category = categories.find(cat => cat.id === product.category);
        return category?.type === 'product';
      })
      .map(product => ({
        value: product.id,
        label: `${product.name} - ${product.sku}`,
        price: parseFloat(product.price.sale || '0'),
        description: product.description
      }));
  };

  const getServiceOptions = () => {
    return products
      .filter(product => {
        const category = categories.find(cat => cat.id === product.category);
        return category?.type === 'service';
      })
      .map(product => ({
        value: product.id,
        label: product.name,
        price: parseFloat(product.price.sale || '0'),
        description: product.description
      }));
  };

  const handleItemSelect = (index: number, value: string) => {
    const allOptions = [...getDeviceOptions(), ...getServiceOptions()];
    const selectedOption = allOptions.find(option => option.value === value);

    if (selectedOption) {
      form.setValue(`items.${index}.name`, selectedOption.label);
      form.setValue(`items.${index}.description`, selectedOption.description || '');
      form.setValue(`items.${index}.unitPrice`, selectedOption.price);
    }
  };

  async function onSubmit(data: AdvancedQuoteFormValues) {
    setIsSubmitting(true);
    try {
      const total = calculateTotal();
      const quoteData = {
        ...data,
        total,
        id: editingData ? editingData.id : `${type.toUpperCase()}-${Date.now()}`,
        date: editingData ? editingData.date : new Date().toLocaleDateString('fr-FR'),
        status: editingData ? editingData.status : (type === "quote" ? "En attente" : "Émise"),
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        tax: calculateTax(),
      };

      if (onSave) {
        onSave(quoteData);
      }

      toast.success(
        type === "quote" ? "Devis créé avec succès" : "Facture créée avec succès",
        {
          description: `${type === "quote" ? "Le devis" : "La facture"} a été créé(e) avec un total de ${total.toLocaleString()} MAD.`,
        }
      );

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGeneratePDF = () => {
    const formData = form.getValues();

    const pdfData: PDFQuoteData = {
      id: `${type.toUpperCase()}-${Date.now()}`,
      client: formData.client,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      clientAddress: formData.clientAddress,
      projectName: formData.projectName,
      description: formData.description,
      date: new Date().toLocaleDateString('fr-FR'),
      items: formData.items,
      subtotal: calculateSubtotal(),
      discount: calculateDiscount(),
      tax: calculateTax(),
      total: calculateTotal(),
      taxRate: formData.taxRate,
      paymentTerms: formData.paymentTerms,
      validityDays: formData.validityDays,
      notes: formData.notes,
      status: type === "quote" ? "En attente" : "Émise",
    };

    const filename = pdfServiceFixed.generateQuotePDF(pdfData, type);
    if (filename) {
      toast.success("PDF généré avec succès", {
        description: `Le fichier ${filename} a été téléchargé.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingData
              ? (type === "quote" ? "Modifier le devis" : "Modifier la facture")
              : (type === "quote" ? "Créer un devis" : "Créer une facture")
            }
          </DialogTitle>
          <DialogDescription>
            {editingData
              ? `Modifiez les informations de ${type === "quote" ? "ce devis" : "cette facture"}.`
              : (type === "quote"
                ? "Créez un devis détaillé avec plusieurs dispositifs et services"
                : "Créez une facture détaillée avec plusieurs dispositifs et services"
              )
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations client */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du client *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'entreprise ou du client" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du projet *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du projet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@exemple.com" {...field} />
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
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="06 XX XX XX XX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="clientAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Adresse complète du client" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description du projet</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description générale du projet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Éléments du devis/facture */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {type === "quote" ? "Éléments du devis" : "Éléments de la facture"}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addItem("device")}
                      className="gap-2"
                    >
                      <Plus size={16} />
                      Dispositif
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addItem("service")}
                      className="gap-2"
                    >
                      <Plus size={16} />
                      Service
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={watchedItems[index]?.type === "device" ? "default" : "secondary"}>
                        {watchedItems[index]?.type === "device" ? "Dispositif" : "Service"}
                      </Badge>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom *</FormLabel>
                            <Select onValueChange={(value) => handleItemSelect(index, value)}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un élément" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {watchedItems[index]?.type === "device" ? (
                                  <>
                                    <SelectItem value="custom">Personnalisé</SelectItem>
                                    {getDeviceOptions().map((device) => (
                                      <SelectItem key={device.value} value={device.value}>
                                        {device.label} - {device.price.toLocaleString()} MAD
                                      </SelectItem>
                                    ))}
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="custom">Personnalisé</SelectItem>
                                    {getServiceOptions().map((service) => (
                                      <SelectItem key={service.value} value={service.value}>
                                        {service.label} - {service.price.toLocaleString()} MAD
                                      </SelectItem>
                                    ))}
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                            <FormControl>
                              <Input placeholder="Ou saisir un nom personnalisé" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Description détaillée" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantité *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prix unitaire (MAD) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.discount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remise (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Calcul pour cet élément */}
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between text-sm">
                        <span>Sous-total:</span>
                        <span>{((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0)).toLocaleString()} MAD</span>
                      </div>
                      {(watchedItems[index]?.discount || 0) > 0 && (
                        <div className="flex justify-between text-sm text-red-600">
                          <span>Remise ({watchedItems[index]?.discount}%):</span>
                          <span>-{(((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0) * (watchedItems[index]?.discount || 0)) / 100).toLocaleString()} MAD</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-medium border-t pt-2 mt-2">
                        <span>Total élément:</span>
                        <span>
                          {(() => {
                            const itemTotal = (watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0);
                            const itemDiscount = ((watchedItems[index]?.discount || 0) / 100) * itemTotal;
                            return (itemTotal - itemDiscount).toLocaleString();
                          })()} MAD
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Calculs et conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calculs et conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TVA (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de remise</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">Pourcentage</SelectItem>
                            <SelectItem value="fixed">Montant fixe</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Remise {watchedDiscountType === "percentage" ? "(%)" : "(MAD)"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conditions de paiement</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="immédiat">Paiement immédiat</SelectItem>
                            <SelectItem value="15 jours">15 jours</SelectItem>
                            <SelectItem value="30 jours">30 jours</SelectItem>
                            <SelectItem value="45 jours">45 jours</SelectItem>
                            <SelectItem value="60 jours">60 jours</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="validityDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validité (jours)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Champs spécifiques aux factures */}
                {type === "invoice" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="invoiceNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de facture</FormLabel>
                            <FormControl>
                              <Input placeholder="FAC-2025-001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date d'échéance</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="advanceAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Montant d'avance (MAD)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="advancePercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pourcentage d'avance (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0"
                                {...field}
                                onChange={(e) => {
                                  const percentage = parseFloat(e.target.value) || 0;
                                  field.onChange(percentage);
                                  // Calculer automatiquement le montant d'avance
                                  const total = calculateTotal();
                                  const advanceAmount = (total * percentage) / 100;
                                  form.setValue("advanceAmount", advanceAmount);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes et conditions particulières</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notes, conditions particulières, garanties..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Récapitulatif des calculs */}
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <h3 className="font-medium text-blue-900 flex items-center gap-2">
                    <Calculator size={16} />
                    Récapitulatif
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{calculateSubtotal().toLocaleString()} MAD</span>
                    </div>
                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Remise:</span>
                        <span>-{calculateDiscount().toLocaleString()} MAD</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>TVA ({watchedTaxRate}%):</span>
                      <span>{calculateTax().toLocaleString()} MAD</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 text-blue-900">
                      <span>Total TTC:</span>
                      <span>{calculateTotal().toLocaleString()} MAD</span>
                    </div>
                    {type === "invoice" && form.watch("advanceAmount") > 0 && (
                      <>
                        <div className="flex justify-between text-orange-600">
                          <span>Avance reçue:</span>
                          <span>-{form.watch("advanceAmount").toLocaleString()} MAD</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 text-green-900">
                          <span>Solde à payer:</span>
                          <span>{(calculateTotal() - form.watch("advanceAmount")).toLocaleString()} MAD</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGeneratePDF}
                className="gap-2"
              >
                <Download size={16} />
                Aperçu PDF
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <FileText size={16} />
                {isSubmitting
                  ? "Création en cours..."
                  : type === "quote" ? "Créer le devis" : "Créer la facture"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
