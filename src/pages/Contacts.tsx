
import React, { useState } from "react";
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
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, MoreVertical, Plus, Search, UserCheck, Eye, Edit, FileText, MessageSquare, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ContactForm } from "@/components/contacts/ContactForm";
import ContactPanel from "@/components/contacts/ContactPanel";
import { AdvancedQuoteForm } from "@/components/invoices/AdvancedQuoteForm";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useContactContext } from "@/contexts/ContactContext";
import { useTaskContext } from "@/contexts/TaskContext";
import { Contact, ContactFormData, QuoteFormData } from "@/types"; // Import necessary types
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function Contacts() {
  const navigate = useNavigate();
  const { contacts, addContact, updateContact, deleteContact } = useContactContext();
  const { addTask } = useTaskContext();

  const [openContactForm, setOpenContactForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactTypeFilter, setContactTypeFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [contactToAssign, setContactToAssign] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactPanelOpen, setContactPanelOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [openQuoteForm, setOpenQuoteForm] = useState(false);
  const [quoteContactData, setQuoteContactData] = useState<Partial<QuoteFormData> | null>(null);
  const [openTaskForm, setOpenTaskForm] = useState(false);

  interface TaskRelatedData {
    contactId: string;
    contactName: string;
    title: string;
    description: string;
  }
  const [taskContactData, setTaskContactData] = useState<TaskRelatedData | null>(null);

  const handleAddContact = (contactData: ContactFormData) => {
    addContact(contactData);
  };

  const handleDeleteContact = (contactId: number) => {
    setContactToDelete(contactId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteContact = () => {
    if (contactToDelete) {
      deleteContact(contactToDelete);
      setContactToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleAssignContact = (contactId: number) => {
    setContactToAssign(contactId);
    setAssignDialogOpen(true);
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setContactPanelOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setOpenContactForm(true);
    toast.info("Modification du contact", {
      description: `Modification de ${contact.name}`
    });
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    updateContact(updatedContact.id, updatedContact);
    setEditingContact(null);
  };



  const confirmAssignContact = () => {
    if (contactToAssign && selectedAgent) {
      updateContact(contactToAssign, { assignedTo: selectedAgent });

      const assignedContact = contacts.find(contact => contact.id === contactToAssign);
      const agentName = selectedAgent === "hamid" ? "Hamid Alaoui" :
                        selectedAgent === "sara" ? "Sara Bennani" :
                        selectedAgent === "karim" ? "Karim Idrissi" : "Personne";

      toast.success("Contact attribué", {
        description: `${assignedContact?.name} a été attribué à ${agentName}.`
      });

      setContactToAssign(null);
      setAssignDialogOpen(false);
      setSelectedAgent("");
    }
  };

  const handleCreateQuote = (contact: Contact) => {
    // Préparer les données du contact pour le formulaire de devis
    setQuoteContactData({
      client: contact.company || contact.name,
      clientEmail: contact.email,
      clientPhone: contact.phone,
      projectName: `Projet pour ${contact.company || contact.name}`,
      description: `Devis pour ${contact.company || contact.name}`,
      notes: contact.notes || ""
    });

    // Ouvrir le formulaire de devis
    setOpenQuoteForm(true);

    // Fermer le panel de contact s'il est ouvert
    setContactPanelOpen(false);

    toast.success("Formulaire de devis ouvert", {
      description: `Création d'un devis pour ${contact.name}`
    });
  };

  const handleCreateTask = (contact: Contact) => {
    // Préparer les données du contact pour le formulaire de tâche
    setTaskContactData({
      contactId: contact.id,
      contactName: contact.name,
      title: `Tâche pour ${contact.name}`,
      description: `Tâche liée au contact ${contact.name} de ${contact.company || 'l\'entreprise'}`
    });

    // Ouvrir le formulaire de tâche
    setOpenTaskForm(true);

    toast.success("Formulaire de tâche ouvert", {
      description: `Création d'une tâche pour ${contact.name}`
    });
  };

  const handleAddNote = (contact: Contact) => {
    // Ouvrir le panel du contact et faire défiler vers la section notes
    setSelectedContact(contact);
    setContactPanelOpen(true);

    // Attendre que le panel s'ouvre puis faire défiler vers les notes
    setTimeout(() => {
      const textarea = document.querySelector('textarea[placeholder="Ajouter une note..."]') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  // Filtrer les contacts en fonction de la recherche et du type
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = contactTypeFilter === "all" || contact.type === contactTypeFilter;

    return matchesSearch && matchesType;
  });

  const getInitials = (name: string) => {
    return name.split(" ").map(name => name[0]).join("");
  };

  const getAssignedToName = (assignedTo: string) => {
    switch(assignedTo) {
      case "hamid": return "Hamid Alaoui";
      case "sara": return "Sara Bennani";
      case "karim": return "Karim Idrissi";
      default: return "Non attribué";
    }
  };

  return (
    <Layout title="Contacts">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher des contacts..."
                className="pl-8 bg-white border-gray-200 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
              <Filter size={16} />
              Filtres
            </Button>
            <Select
              value={contactTypeFilter}
              onValueChange={setContactTypeFilter}
            >
              <SelectTrigger className="w-[180px] hidden md:flex">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="partenaire">Partenaire</SelectItem>
                <SelectItem value="fournisseur">Fournisseur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="gap-2" onClick={() => {
            setEditingContact(null);
            setOpenContactForm(true);
          }}>
            <Plus size={16} />
            Ajouter un contact
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nom / Entreprise</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Téléphone</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Source</TableHead>
                  <TableHead className="hidden md:table-cell">Assigné à</TableHead>
                  <TableHead className="hidden lg:table-cell">Dernier Contact</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewContact(contact)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="hidden sm:flex h-9 w-9">
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                              {getInitials(contact.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-muted-foreground">{contact.company}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">{contact.email}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">{contact.phone}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className={
                            contact.type === "client"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : contact.type === "prospect"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : contact.type === "partenaire"
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">{contact.source}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">{getAssignedToName(contact.assignedTo)}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">{contact.lastContact}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleViewContact(contact);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir profil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEditContact(contact);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleCreateQuote(contact);
                            }}>
                              <FileText className="mr-2 h-4 w-4" />
                              Créer un devis
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleAssignContact(contact.id);
                            }}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Attribuer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleCreateTask(contact);
                            }}>
                              <Plus className="mr-2 h-4 w-4" />
                              Créer une tâche
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleAddNote(contact);
                            }}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Ajouter une note
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteContact(contact.id);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      Aucun contact trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <ContactForm
        open={openContactForm}
        onOpenChange={(open) => {
          setOpenContactForm(open);
          if (!open) setEditingContact(null);
        }}
        onAddContact={handleAddContact}
        editContact={editingContact}
        onEditContact={handleUpdateContact}
      />

      <ContactPanel
        contact={selectedContact}
        isOpen={contactPanelOpen}
        onClose={() => setContactPanelOpen(false)}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
        onCreateQuote={handleCreateQuote}
        onAddNote={(contact, note) => {
          // Mettre à jour le contact avec la nouvelle note
          const newNotes = contact.notes
            ? `${contact.notes}\n\n[${new Date().toLocaleDateString()}] ${note}`
            : `[${new Date().toLocaleDateString()}] ${note}`;

          updateContact(contact.id, { notes: newNotes });

          toast.success("Note ajoutée", {
            description: `Note ajoutée pour ${contact.name}`
          });
        }}
      />

      <AdvancedQuoteForm
        open={openQuoteForm}
        onOpenChange={(open) => {
          setOpenQuoteForm(open);
          if (!open) setQuoteContactData(null);
        }}
        onSave={(quoteData) => {
          // Sauvegarder le devis (ici on peut l'ajouter à une liste locale ou l'envoyer à une API)
          toast.success("Devis créé avec succès", {
            description: `Devis ${quoteData.id} pour ${quoteData.client}`,
            action: {
              label: "Voir devis",
              onClick: () => navigate('/quotes')
            }
          });

          // Fermer le formulaire
          setOpenQuoteForm(false);
          setQuoteContactData(null);
        }}
        type="quote"
        editingData={quoteContactData}
      />

      <TaskForm
        open={openTaskForm}
        onOpenChange={(open) => {
          setOpenTaskForm(open);
          if (!open) setTaskContactData(null);
        }}
        onAddTask={(taskData) => {
          addTask(taskData);
          setOpenTaskForm(false);
          setTaskContactData(null);
        }}
        contactId={taskContactData?.contactId}
        contactName={taskContactData?.contactName}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce contact?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le contact sera supprimé définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteContact} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Attribuer le contact</AlertDialogTitle>
            <AlertDialogDescription>
              Sélectionnez un commercial pour ce contact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un commercial" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hamid">Hamid Alaoui</SelectItem>
                <SelectItem value="sara">Sara Bennani</SelectItem>
                <SelectItem value="karim">Karim Idrissi</SelectItem>
                <SelectItem value="non-attribue">Non attribué</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAssignContact}
              disabled={!selectedAgent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Attribuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
