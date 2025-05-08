
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
import { Filter, MoreVertical, Plus, Search, UserCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ContactForm } from "@/components/contacts/ContactForm";
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
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Imane Alaoui",
      company: "MarketPro Digital",
      email: "imane.alaoui@marketpro.ma",
      phone: "06 12 34 56 78",
      type: "client",
      source: "LinkedIn",
      lastContact: "12 Avr 2025",
      assignedTo: "sara",
      notes: "Intéressé par nos écrans tactiles pour leur showroom"
    },
    {
      id: 2,
      name: "Mehdi Bensaid",
      company: "TechSolutions Maroc",
      email: "m.bensaid@techsolutions.ma",
      phone: "06 98 76 54 32",
      type: "prospect",
      source: "Facebook Ads",
      lastContact: "28 Mar 2025",
      assignedTo: "hamid",
      notes: "À recontacter en mai pour proposition commerciale"
    },
    {
      id: 3,
      name: "Sarah Mansouri",
      company: "Event Masters",
      email: "sarah@eventmasters.ma",
      phone: "06 55 66 77 88",
      type: "client",
      source: "Site Web",
      lastContact: "15 Avr 2025",
      assignedTo: "karim",
      notes: "Projet d'installation pour salon professionnel en juin"
    },
    {
      id: 4,
      name: "Karim El Fassi",
      company: "MediaVision",
      email: "k.elfassi@mediavision.ma",
      phone: "06 11 22 33 44",
      type: "prospect",
      source: "Instagram",
      lastContact: "08 Avr 2025",
      assignedTo: "non-attribue",
      notes: ""
    },
    {
      id: 5,
      name: "Laila Benjelloun",
      company: "Design Studio",
      email: "laila@designstudio.ma",
      phone: "06 22 33 44 55",
      type: "client",
      source: "Recommandation",
      lastContact: "20 Avr 2025",
      assignedTo: "sara",
      notes: "Client fidèle, prévoir mise à jour de son installation"
    },
    {
      id: 6,
      name: "Hamza Chraibi",
      company: "EventPro",
      email: "hamza@eventpro.ma",
      phone: "06 33 44 55 66",
      type: "prospect",
      source: "Salon Professionnel",
      lastContact: "05 Avr 2025",
      assignedTo: "hamid",
      notes: "Demande de devis envoyée le 5 avril"
    },
  ]);

  const [openContactForm, setOpenContactForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactTypeFilter, setContactTypeFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [contactToAssign, setContactToAssign] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState("");

  const handleAddContact = (contactData: any) => {
    const newContact = {
      id: contacts.length + 1,
      ...contactData,
      lastContact: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };
    
    setContacts([newContact, ...contacts]);
    
    toast.success("Contact ajouté", {
      description: `${contactData.name} a été ajouté avec succès.`
    });
  };

  const handleDeleteContact = (contactId: number) => {
    setContactToDelete(contactId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteContact = () => {
    if (contactToDelete) {
      const updatedContacts = contacts.filter(contact => contact.id !== contactToDelete);
      setContacts(updatedContacts);
      
      const deletedContact = contacts.find(contact => contact.id === contactToDelete);
      
      toast.success("Contact supprimé", {
        description: `${deletedContact?.name} a été supprimé avec succès.`
      });
      
      setContactToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleAssignContact = (contactId: number) => {
    setContactToAssign(contactId);
    setAssignDialogOpen(true);
  };

  const confirmAssignContact = () => {
    if (contactToAssign && selectedAgent) {
      const updatedContacts = contacts.map(contact => {
        if (contact.id === contactToAssign) {
          return {
            ...contact,
            assignedTo: selectedAgent
          };
        }
        return contact;
      });
      
      setContacts(updatedContacts);
      
      const assignedContact = updatedContacts.find(contact => contact.id === contactToAssign);
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
          <Button className="gap-2" onClick={() => setOpenContactForm(true)}>
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
                    <TableRow key={contact.id}>
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
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir profil</DropdownMenuItem>
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAssignContact(contact.id)}>
                              <UserCheck className="mr-2 h-4 w-4" /> 
                              Attribuer
                            </DropdownMenuItem>
                            <DropdownMenuItem>Créer une tâche</DropdownMenuItem>
                            <DropdownMenuItem>Ajouter une note</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
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
        onOpenChange={setOpenContactForm}
        onAddContact={handleAddContact}
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
