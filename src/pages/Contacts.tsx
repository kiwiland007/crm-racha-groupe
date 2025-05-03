
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
import { Filter, MoreVertical, Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Contacts() {
  const contacts = [
    {
      id: 1,
      name: "Imane Alaoui",
      company: "MarketPro Digital",
      email: "imane.alaoui@marketpro.ma",
      phone: "06 12 34 56 78",
      type: "client",
      source: "LinkedIn",
      lastContact: "12 Avr 2025",
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
    },
  ];

  const handleAddContact = () => {
    toast.info("Fonctionnalité à venir", {
      description: "La création de contacts sera bientôt disponible."
    });
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
              />
            </div>
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
              <Filter size={16} />
              Filtres
            </Button>
            <Select>
              <SelectTrigger className="w-[180px] hidden md:flex">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="gap-2" onClick={handleAddContact}>
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
                  <TableHead className="hidden lg:table-cell">Dernier Contact</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="hidden sm:flex h-9 w-9">
                          <AvatarFallback className="bg-racha-blue/10 text-racha-blue">
                            {contact.name.split(" ").map(name => name[0]).join("")}
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
                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {contact.type === "client" ? "Client" : "Prospect"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm">{contact.source}</div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm">{contact.lastContact}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Voir profil</DropdownMenuItem>
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Créer une tâche</DropdownMenuItem>
                          <DropdownMenuItem>Ajouter une note</DropdownMenuItem>
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
    </Layout>
  );
}
