
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Contact } from "@/contexts/ContactContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  }),
  company: z.string().min(1, {
    message: "Le nom de l'entreprise est requis",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide",
  }),
  phone: z.string().min(8, {
    message: "Le numéro de téléphone doit contenir au moins 8 caractères",
  }),
  type: z.string({
    required_error: "Veuillez sélectionner un type",
  }),
  source: z.string({
    required_error: "Veuillez sélectionner une source",
  }),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

export function ContactForm({
  open,
  onOpenChange,
  onAddContact,
  editContact,
  onEditContact
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddContact: (data: ContactFormValues) => void;
  editContact?: Contact;
  onEditContact?: (data: ContactFormValues) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      type: "prospect",
      source: "Site Web",
      notes: "",
      assignedTo: "",
    },
  });

  // Effet pour remplir le formulaire quand editContact change
  useEffect(() => {
    if (editContact) {
      form.reset({
        name: editContact.name || "",
        company: editContact.company || "",
        email: editContact.email || "",
        phone: editContact.phone || "",
        type: editContact.type || "prospect",
        source: editContact.source || "Site Web",
        notes: editContact.notes || "",
        assignedTo: editContact.assignedTo || "",
      });
    } else {
      form.reset({
        name: "",
        company: "",
        email: "",
        phone: "",
        type: "prospect",
        source: "Site Web",
        notes: "",
        assignedTo: "",
      });
    }
  }, [editContact, form]);

  function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);

    try {
      if (editContact && onEditContact) {
        // Modifier le contact existant
        onEditContact({ ...editContact, ...data });
        toast.success("Contact modifié avec succès");
      } else {
        // Ajouter un nouveau contact
        onAddContact(data);
        toast.success("Contact ajouté avec succès");
      }

      // Réinitialiser le formulaire
      form.reset();

      // Fermer le dialogue
      onOpenChange(false);
    } catch (error) {
      toast.error(editContact ? "Erreur lors de la modification du contact" : "Erreur lors de l'ajout du contact");
      console.error("Erreur de contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editContact ? "Modifier le contact" : "Ajouter un contact"}</DialogTitle>
          <DialogDescription>
            {editContact
              ? "Modifiez les informations du contact."
              : "Remplissez les informations pour ajouter un nouveau contact."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'entreprise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemple.ma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="prospect">Prospect</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="partenaire">Partenaire</SelectItem>
                        <SelectItem value="fournisseur">Fournisseur</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Site Web">Site Web</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Recommandation">Recommandation</SelectItem>
                        <SelectItem value="Salon Professionnel">Salon Professionnel</SelectItem>
                        <SelectItem value="Publicité">Publicité</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attribué à</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un commercial" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hamid">Hamid Alaoui</SelectItem>
                      <SelectItem value="sara">Sara Bennani</SelectItem>
                      <SelectItem value="karim">Karim Idrissi</SelectItem>
                      <SelectItem value="non-attribue">Non attribué</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informations supplémentaires sur le contact"
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting
                  ? (editContact ? "Modification en cours..." : "Ajout en cours...")
                  : (editContact ? "Modifier le contact" : "Ajouter le contact")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
